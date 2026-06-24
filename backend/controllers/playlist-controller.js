const db = require('../config/db');

const createPlaylist = async (req, res) => {
    try {
        const userId = req.user.id_user;
        const { nama_playlist, deskripsi, is_public } = req.body;

        if (!nama_playlist) {
            return res.status(400).json({ success: false, message: 'Nama playlist wajib diisi' });
        }

        const [result] = await db.query(
            'INSERT INTO playlists (user_id, nama_playlist, deskripsi, is_public) VALUES (?, ?, ?, ?)',
            [userId, nama_playlist, deskripsi || null, is_public ?? true]
        );

        res.status(201).json({
            success: true,
            message: 'Playlist berhasil dibuat',
            data: { id_playlist: result.insertId, nama_playlist, deskripsi, is_public: is_public ?? true }
        });

    } catch (error) {
        console.error('Error saat membuat playlist:', error);
        res.status(500).json({ success: false, message: 'Gagal membuat playlist' });
    }
};

const getMyPlaylists = async (req, res) => {
    try {
        const userId = req.user.id_user;

        const [playlists] = await db.query(
            `SELECT p.id_playlist, p.nama_playlist, p.deskripsi, p.is_public, p.created_at,
                    COUNT(ps.song_id) AS total_lagu
             FROM playlists p
             LEFT JOIN playlist_songs ps ON p.id_playlist = ps.playlist_id
             WHERE p.user_id = ?
             GROUP BY p.id_playlist
             ORDER BY p.created_at DESC`,
            [userId]
        );

        res.status(200).json({ success: true, data: playlists });

    } catch (error) {
        console.error('Error saat mengambil playlist:', error);
        res.status(500).json({ success: false, message: 'Gagal memuat playlist' });
    }
};

const searchPlaylists = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim() === '') {
            return res.status(400).json({ success: false, message: 'Kata kunci pencarian wajib diisi' });
        }

        const keyword = `%${q}%`;

        const [results] = await db.query(
            `SELECT p.id_playlist, p.nama_playlist, p.deskripsi, p.created_at,
                    u.nama_lengkap AS pembuat,
                    COUNT(ps.song_id) AS total_lagu
             FROM playlists p
             JOIN users u ON p.user_id = u.id_user
             LEFT JOIN playlist_songs ps ON p.id_playlist = ps.playlist_id
             WHERE p.is_public = TRUE
               AND (p.nama_playlist LIKE ? OR u.nama_lengkap LIKE ?)
             GROUP BY p.id_playlist
             ORDER BY total_lagu DESC`,
            [keyword, keyword]
        );

        res.status(200).json({ success: true, data: results });

    } catch (error) {
        console.error('Error saat mencari playlist:', error);
        res.status(500).json({ success: false, message: 'Gagal mencari playlist' });
    }
};

const addSongToPlaylist = async (req, res) => {
    try {
        const userId = req.user.id_user;
        const { playlistId } = req.params;
        const { youtube_id, judul, channel, durasi, thumbnail } = req.body;

        if (!youtube_id || !judul) {
            return res.status(400).json({ success: false, message: 'Data lagu tidak lengkap' });
        }

        // Pastikan playlist ini benar milik user yang login
        const [playlistCheck] = await db.query(
            'SELECT id_playlist FROM playlists WHERE id_playlist = ? AND user_id = ?',
            [playlistId, userId]
        );
        if (playlistCheck.length === 0) {
            return res.status(403).json({ success: false, message: 'Playlist tidak ditemukan atau bukan milikmu' });
        }

        // Cek apakah lagu sudah ada di tabel master 'songs', kalau belum, insert dulu
        let [existingSong] = await db.query('SELECT id_song FROM songs WHERE youtube_id = ?', [youtube_id]);
        let songId;

        if (existingSong.length > 0) {
            songId = existingSong[0].id_song;
        } else {
            const [insertResult] = await db.query(
                'INSERT INTO songs (youtube_id, judul, channel, durasi, thumbnail) VALUES (?, ?, ?, ?, ?)',
                [youtube_id, judul, channel || null, durasi || null, thumbnail || null]
            );
            songId = insertResult.insertId;
        }

        // Baru masukkan ke playlist (pivot table)
        await db.query(
            'INSERT INTO playlist_songs (playlist_id, song_id) VALUES (?, ?)',
            [playlistId, songId]
        );

        res.status(201).json({ success: true, message: 'Lagu berhasil ditambahkan ke playlist' });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, message: 'Lagu ini sudah ada di playlist' });
        }
        console.error('❌ Error saat menambah lagu ke playlist:', error);
        res.status(500).json({ success: false, message: 'Gagal menambahkan lagu' });
    }
};

const getPlaylistSongs = async (req, res) => {
    try {
        const { playlistId } = req.params;

        const [songs] = await db.query(
            `SELECT s.id_song, s.youtube_id, s.judul, s.channel, s.durasi, s.thumbnail
             FROM playlist_songs ps
             JOIN songs s ON ps.song_id = s.id_song
             WHERE ps.playlist_id = ?
             ORDER BY ps.urutan ASC, ps.added_at ASC`,
            [playlistId]
        );

        res.status(200).json({ success: true, data: songs });

    } catch (error) {
        console.error('❌ Error saat mengambil lagu playlist:', error);
        res.status(500).json({ success: false, message: 'Gagal memuat lagu playlist' });
    }
};

const removeSongFromPlaylist = async (req, res) => {
    try {
        const userId = req.user.id_user;
        const { playlistId, songId } = req.params;

        const [playlistCheck] = await db.query(
            'SELECT id_playlist FROM playlists WHERE id_playlist = ? AND user_id = ?',
            [playlistId, userId]
        );
        if (playlistCheck.length === 0) {
            return res.status(403).json({ success: false, message: 'Playlist tidak ditemukan atau bukan milikmu' });
        }

        await db.query(
            'DELETE FROM playlist_songs WHERE playlist_id = ? AND song_id = ?',
            [playlistId, songId]
        );

        res.status(200).json({ success: true, message: 'Lagu berhasil dihapus dari playlist' });

    } catch (error) {
        console.error('❌ Error saat menghapus lagu:', error);
        res.status(500).json({ success: false, message: 'Gagal menghapus lagu' });
    }
};

const deletePlaylist = async (req, res) => {
    try {
        const userId = req.user.id_user;
        const { playlistId } = req.params;

        const [result] = await db.query(
            'DELETE FROM playlists WHERE id_playlist = ? AND user_id = ?',
            [playlistId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(403).json({ success: false, message: 'Playlist tidak ditemukan atau bukan milikmu' });
        }

        res.status(200).json({ success: true, message: 'Playlist berhasil dihapus' });

    } catch (error) {
        console.error('❌ Error saat menghapus playlist:', error);
        res.status(500).json({ success: false, message: 'Gagal menghapus playlist' });
    }
};

module.exports = {
    createPlaylist,
    getMyPlaylists,
    searchPlaylists,
    addSongToPlaylist,
    getPlaylistSongs,
    removeSongFromPlaylist,
    deletePlaylist
};