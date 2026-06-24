const db = require('../config/db');

// Cari user by nama lengkap (untuk popup pencarian teman)
const searchUsers = async (req, res) => {
    try {
        const userId = req.user.id_user;
        const { q } = req.query;

        if (!q || q.trim().length < 2) {
            return res.status(400).json({ success: false, message: 'Minimal 2 karakter untuk pencarian' });
        }

        const [users] = await db.query(
            `SELECT u.id_user, u.nama_lengkap, u.email,
                    f.status AS friendship_status,
                    f.requester_id
             FROM users u
             LEFT JOIN friends f ON (
                 (f.user_id = ? AND f.friend_id = u.id_user) OR
                 (f.friend_id = ? AND f.user_id = u.id_user)
             )
             WHERE u.id_user != ? AND u.nama_lengkap LIKE ?
             LIMIT 10`,
            [userId, userId, userId, `%${q}%`]
        );

        res.status(200).json({ success: true, data: users });

    } catch (error) {
        console.error('❌ Error searchUsers:', error);
        res.status(500).json({ success: false, message: 'Gagal mencari user' });
    }
};

// Lihat daftar teman yang sudah accepted
const getFriends = async (req, res) => {
    try {
        const userId = req.user.id_user;

        const [friends] = await db.query(
            `SELECT u.id_user, u.nama_lengkap, u.email
             FROM friends f
             JOIN users u ON (
                 CASE WHEN f.user_id = ? THEN f.friend_id ELSE f.user_id END = u.id_user
             )
             WHERE f.status = 'accepted'
               AND (f.user_id = ? OR f.friend_id = ?)`,
            [userId, userId, userId]
        );

        res.status(200).json({ success: true, data: friends });

    } catch (error) {
        console.error('❌ Error getFriends:', error);
        res.status(500).json({ success: false, message: 'Gagal memuat daftar teman' });
    }
};

// Kirim friend request
const sendFriendRequest = async (req, res) => {
    try {
        const requesterId = req.user.id_user;
        const { friend_id } = req.body;

        if (requesterId === Number(friend_id)) {
            return res.status(400).json({ success: false, message: 'Tidak bisa menambah diri sendiri' });
        }

        const [existing] = await db.query(
            `SELECT id_pertemanan, status FROM friends
             WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)`,
            [requesterId, friend_id, friend_id, requesterId]
        );

        if (existing.length > 0) {
            const status = existing[0].status;
            if (status === 'accepted') return res.status(400).json({ success: false, message: 'Sudah berteman' });
            if (status === 'pending') return res.status(400).json({ success: false, message: 'Permintaan sudah terkirim' });
        }

        await db.query(
            'INSERT INTO friends (user_id, friend_id, requester_id, status) VALUES (?, ?, ?, ?)',
            [requesterId, friend_id, requesterId, 'pending']
        );

        res.status(201).json({ success: true, message: 'Permintaan pertemanan terkirim' });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, message: 'Permintaan sudah pernah dikirim' });
        }
        console.error('❌ Error sendFriendRequest:', error);
        res.status(500).json({ success: false, message: 'Gagal mengirim permintaan' });
    }
};

// Lihat semua request yang masuk
const getIncomingRequests = async (req, res) => {
    try {
        const userId = req.user.id_user;

        const [requests] = await db.query(
            `SELECT f.id_pertemanan, u.id_user, u.nama_lengkap, u.email, f.created_at
             FROM friends f
             JOIN users u ON f.requester_id = u.id_user
             WHERE f.status = 'pending'
               AND f.requester_id != ?
               AND (f.user_id = ? OR f.friend_id = ?)`,
            [userId, userId, userId]
        );

        res.status(200).json({ success: true, data: requests });

    } catch (error) {
        console.error('❌ Error getIncomingRequests:', error);
        res.status(500).json({ success: false, message: 'Gagal memuat permintaan' });
    }
};

// Terima atau tolak request
const respondFriendRequest = async (req, res) => {
    try {
        const userId = req.user.id_user;
        const { id_pertemanan } = req.params;
        const { action } = req.body;

        if (!['accept', 'reject'].includes(action)) {
            return res.status(400).json({ success: false, message: 'Action tidak valid' });
        }

        const [friendship] = await db.query(
            'SELECT * FROM friends WHERE id_pertemanan = ?',
            [id_pertemanan]
        );

        if (friendship.length === 0) {
            return res.status(404).json({ success: false, message: 'Permintaan tidak ditemukan' });
        }

        if (friendship[0].requester_id === userId) {
            return res.status(403).json({ success: false, message: 'Tidak bisa menerima permintaanmu sendiri' });
        }

        const newStatus = action === 'accept' ? 'accepted' : 'rejected';
        await db.query('UPDATE friends SET status = ? WHERE id_pertemanan = ?', [newStatus, id_pertemanan]);

        res.status(200).json({
            success: true,
            message: action === 'accept' ? 'Permintaan diterima' : 'Permintaan ditolak'
        });

    } catch (error) {
        console.error('❌ Error respondFriendRequest:', error);
        res.status(500).json({ success: false, message: 'Gagal memproses permintaan' });
    }
};

// Hapus teman
const removeFriend = async (req, res) => {
    try {
        const userId = req.user.id_user;
        const { friendId } = req.params;

        const [result] = await db.query(
            `DELETE FROM friends
             WHERE status = 'accepted'
               AND ((user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?))`,
            [userId, friendId, friendId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Pertemanan tidak ditemukan' });
        }

        res.status(200).json({ success: true, message: 'Teman berhasil dihapus' });

    } catch (error) {
        console.error('❌ Error removeFriend:', error);
        res.status(500).json({ success: false, message: 'Gagal menghapus teman' });
    }
};

module.exports = { searchUsers, sendFriendRequest, getIncomingRequests, respondFriendRequest, getFriends, removeFriend };