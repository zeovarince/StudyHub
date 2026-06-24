const db = require('../config/db');

exports.createTask = async (req, res) => {
    try {
        // Ambil ID User dari token JWT (Middleware)
        const id_pembuat = req.user.id_user; 
        const { judul, deskripsi, mata_kuliah, due_date } = req.body;
        
        const query = 'INSERT INTO tasks (id_pembuat, judul, deskripsi, mata_kuliah, due_date, status) VALUES (?, ?, ?, ?, ?, ?)';
        const [result] = await db.query(query, [id_pembuat, judul, deskripsi, mata_kuliah, due_date, 'Belum']);
        
        res.status(201).json({ success: true, message: 'Tugas berhasil dibuat', taskId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Gagal membuat tugas', error: error.message });
    }
};

exports.getAllTasks = async (req, res) => {
    try {
        const userId = req.user.id_user;
        // Ambil tugas di mana user adalah pembuat ATAU bagian dari anggota tugas tersebut
        const query = `
            SELECT DISTINCT t.* FROM tasks t
            LEFT JOIN task_members tm ON t.id_task = tm.task_id
            WHERE t.id_pembuat = ? OR tm.user_id = ?
            ORDER BY t.due_date ASC
        `;
        const [results] = await db.query(query, [userId, userId]);
        res.status(200).json({ success: true, data: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data tugas' });
    }
};

exports.updateTaskStatus = async (req, res) => {
    try {
        const { id } = req.params; // ini adalah id_task
        const { status } = req.body; // 'Belum', 'Proses', 'Selesai'
        
        const query = 'UPDATE tasks SET status = ? WHERE id_task = ?';
        await db.query(query, [status, id]);
        
        res.status(200).json({ success: true, message: 'Status tugas berhasil diperbarui' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Gagal memperbarui status tugas' });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM tasks WHERE id_task = ?';
        await db.query(query, [id]);
        
        res.status(200).json({ success: true, message: 'Tugas berhasil dihapus' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Gagal menghapus tugas' });
    }
};

// --- BAGIAN KOLABORASI (INVITE MEMBER) ---

exports.inviteMember = async (req, res) => {
    try {
        const taskId = req.params.id;
        const { userId } = req.body; // ID teman yang mau diinvite

        const query = 'INSERT INTO task_members (task_id, user_id) VALUES (?, ?)';
        await db.query(query, [taskId, userId]);
        
        res.status(201).json({ success: true, message: 'Anggota berhasil ditambahkan ke tugas' });
    } catch (error) {
        console.error(error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, message: 'Anggota sudah ada di dalam tugas ini' });
        }
        res.status(500).json({ success: false, message: 'Gagal menambahkan anggota' });
    }
};

exports.getTaskMembers = async (req, res) => {
    try {
        const taskId = req.params.id;
        const query = `
            SELECT u.id_user, u.nama_lengkap, u.email 
            FROM users u
            JOIN task_members tm ON u.id_user = tm.user_id 
            WHERE tm.task_id = ?
        `;
        const [results] = await db.query(query, [taskId]);
        res.status(200).json({ success: true, data: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data anggota' });
    }
};

exports.removeMember = async (req, res) => {
    try {
        const taskId = req.params.id;
        const userId = req.params.userId;

        const query = 'DELETE FROM task_members WHERE task_id = ? AND user_id = ?';
        await db.query(query, [taskId, userId]);
        
        res.status(200).json({ success: true, message: 'Anggota berhasil dikeluarkan dari tugas' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Gagal mengeluarkan anggota' });
    }
};