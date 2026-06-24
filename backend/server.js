const express = require('express');

const authRoutes = require('./routes/auth-routes');
const uploadRoutes = require('./routes/upload-routes');
const verifyToken = require('./middlewares/auth-middleware');
const musicRoutes = require('./routes/music-routes');
const friendsRoutes = require('./routes/friends-routes');
const taskRoutes = require('./routes/task-routes');
const playlistRoutes = require('./routes/playlist-routes');
const cors = require('cors');

const app = express();

app.use(cors())
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/music', musicRoutes);
app.use('/api/friends', friendsRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/playlists', playlistRoutes);

app.get('/', (req, res) => {
    res.send('StudyHub API Running');
});

app.get('/api/profile', verifyToken, (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});

app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        success: false,
        message: err.message
    });
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});