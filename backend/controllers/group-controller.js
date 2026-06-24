const db = require('../config/db');

// ============================================================
// GRUP STUDI — CRUD
// ============================================================

// Buat grup baru, otomatis creator jadi anggota pertama
const createGroup = async (req, res) => {
    try {
        const ownerId = req.user.id_user;
        const { nama_group, deskripsi } = req.body;

        if (!nama_group) {
            return res.status(400).json({ success: false, message: 'Nama grup wajib diisi' });
        }

        const [result] = await db.query(
            'INSERT INTO study_groups (nama_group, deskripsi, owner_id) VALUES (?, ?, ?)',
            [nama_group, deskripsi || null, ownerId]
        );

        const groupId = result.insertId;

        // Otomatis masukkan creator sebagai anggota pertama
        await db.query(
            'INSERT INTO group_members (group_id, user_id) VALUES (?, ?)',
            [groupId, ownerId]
        );

        res.status(201).json({
            success: true,
            message: 'Grup berhasil dibuat',
            data: { id_group: groupId, nama_group, deskripsi, owner_id: ownerId }
        });

    } catch (error) {
        console.error('❌ Error createGroup:', error);
        res.status(500).json({ success: false, message: 'Gagal membuat grup' });
    }
};

// Lihat semua grup yang diikuti user yang login
const getMyGroups = async (req, res) => {
    try {
        const userId = req.user.id_user;

        const [groups] = await db.query(
            `SELECT g.id_group, g.nama_group, g.deskripsi, g.owner_id,
                    u.nama_lengkap AS nama_owner,
                    COUNT(gm.user_id) AS total_anggota
             FROM study_groups g
             JOIN group_members gm ON g.id_group = gm.group_id
             JOIN users u ON g.owner_id = u.id_user
             WHERE gm.user_id = ?
             GROUP BY g.id_group
             ORDER BY g.created_at DESC`,
            [userId]
        );

        res.status(200).json({ success: true, data: groups });

    } catch (error) {
        console.error('❌ Error getMyGroups:', error);
        res.status(500).json({ success: false, message: 'Gagal memuat grup' });
    }
};

// Lihat detail 1 grup beserta daftar anggotanya
const getGroupDetail = async (req, res) => {
    try {
        const userId = req.user.id_user;
        const { groupId } = req.params;

        // Pastikan user adalah anggota grup ini
        const [memberCheck] = await db.query(
            'SELECT id_member FROM group_members WHERE group_id = ? AND user_id = ?',
            [groupId, userId]
        );

        if (memberCheck.length === 0) {
            return res.status(403).json({ success: false, message: 'Kamu bukan anggota grup ini' });
        }

        // Ambil info grup
        const [group] = await db.query(
            `SELECT g.*, u.nama_lengkap AS nama_owner
             FROM study_groups g
             JOIN users u ON g.owner_id = u.id_user
             WHERE g.id_group = ?`,
            [groupId]
        );

        // Ambil daftar anggota
        const [members] = await db.query(
            `SELECT u.id_user, u.nama_lengkap, u.email, gm.joined_at
             FROM group_members gm
             JOIN users u ON gm.user_id = u.id_user
             WHERE gm.group_id = ?
             ORDER BY gm.joined_at ASC`,
            [groupId]
        );

        res.status(200).json({
            success: true,
            data: { ...group[0], anggota: members }
        });

    } catch (error) {
        console.error('❌ Error getGroupDetail:', error);
        res.status(500).json({ success: false, message: 'Gagal memuat detail grup' });
    }
};

// Hapus grup — hanya bisa dilakukan owner
const deleteGroup = async (req, res) => {
    try {
        const userId = req.user.id_user;
        const { groupId } = req.params;

        const [result] = await db.query(
            'DELETE FROM study_groups WHERE id_group = ? AND owner_id = ?',
            [groupId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(403).json({ success: false, message: 'Grup tidak ditemukan atau kamu bukan owner' });
        }

        res.status(200).json({ success: true, message: 'Grup berhasil dihapus' });

    } catch (error) {
        console.error('❌ Error deleteGroup:', error);
        res.status(500).json({ success: false, message: 'Gagal menghapus grup' });
    }
};

// ============================================================
// ANGGOTA GRUP
// ============================================================

// Tambah teman ke grup — hanya bisa dilakukan owner
// Hanya teman (status accepted) yang bisa diundang
const addMember = async (req, res) => {
    try {
        const userId = req.user.id_user;
        const { groupId } = req.params;
        const { friend_id } = req.body;

        // Pastikan yang request adalah owner grup
        const [groupCheck] = await db.query(
            'SELECT id_group FROM study_groups WHERE id_group = ? AND owner_id = ?',
            [groupId, userId]
        );

        if (groupCheck.length === 0) {
            return res.status(403).json({ success: false, message: 'Hanya owner yang bisa menambah anggota' });
        }

        // Pastikan yang diundang adalah teman (status accepted)
        const [friendCheck] = await db.query(
            `SELECT id_pertemanan FROM friends
             WHERE status = 'accepted'
               AND ((user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?))`,
            [userId, friend_id, friend_id, userId]
        );

        if (friendCheck.length === 0) {
            return res.status(400).json({ success: false, message: 'User tersebut bukan temanmu' });
        }

        // Masukkan ke grup
        await db.query(
            'INSERT INTO group_members (group_id, user_id) VALUES (?, ?)',
            [groupId, friend_id]
        );

        res.status(201).json({ success: true, message: 'Anggota berhasil ditambahkan' });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, message: 'User sudah menjadi anggota grup ini' });
        }
        console.error('❌ Error addMember:', error);
        res.status(500).json({ success: false, message: 'Gagal menambah anggota' });
    }
};

// Keluar dari grup — siapa saja bisa, tapi owner tidak bisa keluar (harus hapus grup)
const leaveGroup = async (req, res) => {
    try {
        const userId = req.user.id_user;
        const { groupId } = req.params;

        // Cek apakah user adalah owner
        const [ownerCheck] = await db.query(
            'SELECT id_group FROM study_groups WHERE id_group = ? AND owner_id = ?',
            [groupId, userId]
        );

        if (ownerCheck.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Owner tidak bisa keluar. Hapus grup jika ingin mengakhirinya.'
            });
        }

        const [result] = await db.query(
            'DELETE FROM group_members WHERE group_id = ? AND user_id = ?',
            [groupId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Kamu bukan anggota grup ini' });
        }

        res.status(200).json({ success: true, message: 'Berhasil keluar dari grup' });

    } catch (error) {
        console.error('❌ Error leaveGroup:', error);
        res.status(500).json({ success: false, message: 'Gagal keluar dari grup' });
    }
};

// Kick anggota — hanya owner yang bisa
const kickMember = async (req, res) => {
    try {
        const userId = req.user.id_user;
        const { groupId, memberId } = req.params;

        // Pastikan yang request adalah owner
        const [ownerCheck] = await db.query(
            'SELECT id_group FROM study_groups WHERE id_group = ? AND owner_id = ?',
            [groupId, userId]
        );

        if (ownerCheck.length === 0) {
            return res.status(403).json({ success: false, message: 'Hanya owner yang bisa mengeluarkan anggota' });
        }

        // Owner tidak bisa kick dirinya sendiri
        if (Number(memberId) === userId) {
            return res.status(400).json({ success: false, message: 'Tidak bisa mengeluarkan diri sendiri' });
        }

        const [result] = await db.query(
            'DELETE FROM group_members WHERE group_id = ? AND user_id = ?',
            [groupId, memberId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Anggota tidak ditemukan' });
        }

        res.status(200).json({ success: true, message: 'Anggota berhasil dikeluarkan' });

    } catch (error) {
        console.error('❌ Error kickMember:', error);
        res.status(500).json({ success: false, message: 'Gagal mengeluarkan anggota' });
    }
};

// ============================================================
// PESAN GRUP (REST — untuk load history)
// Real-time send/receive ditangani Socket.io di server.js
// ============================================================

// Ambil history pesan (50 pesan terakhir)
const getMessages = async (req, res) => {
    try {
        const userId = req.user.id_user;
        const { groupId } = req.params;
        const { before } = req.query; // untuk pagination: id_message terakhir yang sudah dimuat

        // Pastikan user anggota grup
        const [memberCheck] = await db.query(
            'SELECT id_member FROM group_members WHERE group_id = ? AND user_id = ?',
            [groupId, userId]
        );

        if (memberCheck.length === 0) {
            return res.status(403).json({ success: false, message: 'Kamu bukan anggota grup ini' });
        }

        // Ambil 50 pesan terakhir, bisa dipaginasi dengan param before=id_message
        const query = before
            ? `SELECT m.id_message, m.message, m.file_url, m.file_type, m.created_at,
                      u.id_user AS sender_id, u.nama_lengkap AS sender_name
               FROM group_messages m
               JOIN users u ON m.sender_id = u.id_user
               WHERE m.group_id = ? AND m.id_message < ?
               ORDER BY m.created_at DESC
               LIMIT 50`
            : `SELECT m.id_message, m.message, m.file_url, m.file_type, m.created_at,
                      u.id_user AS sender_id, u.nama_lengkap AS sender_name
               FROM group_messages m
               JOIN users u ON m.sender_id = u.id_user
               WHERE m.group_id = ?
               ORDER BY m.created_at DESC
               LIMIT 50`;

        const params = before ? [groupId, before] : [groupId];
        const [messages] = await db.query(query, params);

        // Balik urutan supaya yang terlama di atas (kronologis)
        res.status(200).json({ success: true, data: messages.reverse() });

    } catch (error) {
        console.error('❌ Error getMessages:', error);
        res.status(500).json({ success: false, message: 'Gagal memuat pesan' });
    }
};

// Simpan pesan ke DB — dipanggil dari Socket.io handler di server.js
// juga bisa dipakai sebagai REST endpoint fallback
const sendMessage = async (req, res) => {
    try {
        const senderId = req.user.id_user;
        const { groupId } = req.params;
        const { message, file_url, file_type } = req.body;

        if (!message && !file_url) {
            return res.status(400).json({ success: false, message: 'Pesan atau file wajib ada' });
        }

        // Pastikan user anggota grup
        const [memberCheck] = await db.query(
            'SELECT id_member FROM group_members WHERE group_id = ? AND user_id = ?',
            [groupId, senderId]
        );

        if (memberCheck.length === 0) {
            return res.status(403).json({ success: false, message: 'Kamu bukan anggota grup ini' });
        }

        const [result] = await db.query(
            'INSERT INTO group_messages (group_id, sender_id, message, file_url, file_type) VALUES (?, ?, ?, ?, ?)',
            [groupId, senderId, message || null, file_url || null, file_type || null]
        );

        // Ambil data pesan lengkap (termasuk nama sender) untuk dikembalikan
        const [newMessage] = await db.query(
            `SELECT m.id_message, m.message, m.file_url, m.file_type, m.created_at,
                    u.id_user AS sender_id, u.nama_lengkap AS sender_name
             FROM group_messages m
             JOIN users u ON m.sender_id = u.id_user
             WHERE m.id_message = ?`,
            [result.insertId]
        );

        res.status(201).json({ success: true, data: newMessage[0] });

    } catch (error) {
        console.error('❌ Error sendMessage:', error);
        res.status(500).json({ success: false, message: 'Gagal mengirim pesan' });
    }
};

module.exports = {
    createGroup,
    getMyGroups,
    getGroupDetail,
    deleteGroup,
    addMember,
    leaveGroup,
    kickMember,
    getMessages,
    sendMessage
};