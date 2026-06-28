const path = require('path');
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const db = require('./config/db');
require('dotenv').config();

const authRoutes = require('./routes/auth-routes');
const uploadRoutes = require('./routes/upload-routes');
const musicRoutes = require('./routes/music-routes');
const friendsRoutes = require('./routes/friends-routes');
const playlistRoutes = require('./routes/playlist-routes');
const groupRoutes = require('./routes/group-routes');
const verifyToken = require('./middlewares/auth-middleware');
const profileRoutes = require('./routes/profile-routes');
const chatRoutes = require('./routes/chat-routes');
const taskRoutes = require('./routes/task-routes');

const app = express();
// Bungkus express dengan http.createServer supaya Socket.io bisa nempel di server yang sama
const server = http.createServer(app);

// Setup Socket.io dengan CORS untuk frontend di localhost:5173
const io = new Server(server, {
    cors: {
        origin: [
            'http://localhost:5173',
            'http://localhost:3000',
            'https://study-hub.my.id',
        ],
        methods: ['GET', 'POST'],
        credentials: true
    }
});

app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://study-hub.my.id',
    ],
    credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Tambahkan io ke req supaya bisa diakses dari controller kalau diperlukan
app.use((req, res, next) => {
    req.io = io;
    next();
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/music', musicRoutes);
app.use('/api/friends', friendsRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => res.send('StudyHub API Running'));

app.get('/api/profile', verifyToken, (req, res) => {
    res.json({ success: true, user: req.user });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
});

// SOCKET.IO — Real-time chat grup

// Middleware Socket.io: verifikasi JWT sebelum koneksi diterima
io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Token tidak ditemukan'));

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded; // simpan data user di socket object
        next();
    } catch (err) {
        next(new Error('Token tidak valid'));
    }
});

io.on('connection', (socket) => {
    console.log(`Socket connected: user ${socket.user?.id_user}`);
    // Frontend kirim event 'join_group' dengan { groupId }
    socket.on('join_group', async ({ groupId }) => {
        try {
            // Verifikasi user memang anggota grup sebelum boleh join room
            const [memberCheck] = await db.query(
                'SELECT id_member FROM group_members WHERE group_id = ? AND user_id = ?',
                [groupId, socket.user.id_user]
            );

            if (memberCheck.length === 0) {
                socket.emit('error', { message: 'Kamu bukan anggota grup ini' });
                return;
            }

            socket.join(`group_${groupId}`);
            console.log(`User ${socket.user.id_user} joined room group_${groupId}`);

        } catch (err) {
            console.error('Error join_group:', err);
        }
    });

    // User keluar dari room grup
    socket.on('leave_group', ({ groupId }) => {
        socket.leave(`group_${groupId}`);
    });
    // Frontend kirim event 'send_message' dengan { groupId, message, file_url, file_type }
    socket.on('send_message', async ({ groupId, message, file_url, file_type }) => {
        try {
            // Validasi: minimal ada teks atau file
            if (!message && !file_url) return;

            // Verifikasi user anggota grup
            const [memberCheck] = await db.query(
                'SELECT id_member FROM group_members WHERE group_id = ? AND user_id = ?',
                [groupId, socket.user.id_user]
            );

            if (memberCheck.length === 0) {
                socket.emit('error', { message: 'Kamu bukan anggota grup ini' });
                return;
            }

            // Simpan pesan ke database
            const [result] = await db.query(
                'INSERT INTO group_messages (group_id, sender_id, message, file_url, file_type) VALUES (?, ?, ?, ?, ?)',
                [groupId, socket.user.id_user, message || null, file_url || null, file_type || null]
            );

            // Ambil data pesan lengkap (termasuk nama sender)
            const [newMessage] = await db.query(
                `SELECT m.id_message, m.message, m.file_url, m.file_type, m.created_at,
                        u.id_user AS sender_id, u.nama_lengkap AS sender_name
                 FROM group_messages m
                 JOIN users u ON m.sender_id = u.id_user
                 WHERE m.id_message = ?`,
                [result.insertId]
            );

            // Broadcast ke semua user di room grup (termasuk pengirim sendiri)
            io.to(`group_${groupId}`).emit('new_message', newMessage[0]);

        } catch (err) {
            console.error('Error send_message socket:', err);
            socket.emit('error', { message: 'Gagal mengirim pesan' });
        }
    });

    socket.on('disconnect', () => {
        console.log(`Socket disconnected: user ${socket.user?.id_user}`);
    });
});

// Ganti app.listen jadi server.listen supaya Socket.io jalan di port yang sama
server.listen(5000, () => {
    console.log('Server + Socket.io running on port 5000');
});