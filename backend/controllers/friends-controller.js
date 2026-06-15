const db = require('../config/db');

const getFriends = async (req, res) => {
    try {
        const userId = req.user.id_user;

        const [friends] = await db.query(
            `SELECT u.id_user, u.nama_lengkap, u.email 
             FROM friends f
             JOIN users u ON f.friend_id = u.id_user
             WHERE f.user_id = ?`,
            [userId]
        );

        res.status(200).json({
            success: true,
            data: friends
        });

    } catch (error) {
        console.error('❌ Error saat mengambil data teman:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server saat memuat teman.'
        });
    }
};

const addFriend = async (req, res) => {
    try {
        const userId = req.user.id_user;
        const { email_teman } = req.body;

        if (!email_teman) {
            return res.status(400).json({ success: false, message: 'Email teman wajib diisi' });
        }

        const [users] = await db.query('SELECT id_user FROM users WHERE email = ?', [email_teman]);
        
        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'Pengguna dengan email tersebut tidak ditemukan' });
        }

        const friendId = users[0].id_user;

        if (userId === friendId) {
            return res.status(400).json({ success: false, message: 'Tidak bisa menambahkan diri sendiri' });
        }

        const [existingFriend] = await db.query(
            'SELECT * FROM friends WHERE user_id = ? AND friend_id = ?',
            [userId, friendId]
        );

        if (existingFriend.length > 0) {
            return res.status(400).json({ success: false, message: 'Kalian sudah berteman!' });
        }

        await db.query('INSERT INTO friends (user_id, friend_id) VALUES (?, ?)', [userId, friendId]);

        res.status(201).json({ success: true, message: 'Teman berhasil ditambahkan' });

    } catch (error) {
        console.error('❌ Error saat menambahkan teman:', error);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server saat menambah teman.' });
    }
};

// Pastikan ekspornya dalam bentuk object { }
module.exports = { getFriends, addFriend };