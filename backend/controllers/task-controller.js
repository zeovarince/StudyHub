const db = require('../config/db');
exports.createTask = (req, res) => {
    const { title, description, deadline } = req.body;
    const defaultStatus = 'To Do';
    const query = 'INSERT INTO tasks (title, description, status, deadline) VALUES (?, ?, ?, ?)';
    
    db.query(query, [title, description, defaultStatus, deadline], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Gagal membuat tugas', error: err });
        }
        res.status(201).json({ message: 'Tugas berhasil dibuat', taskId: result.insertId });
    });
};

exports.getAllTasks = (req, res) => {
    const query = 'SELECT * FROM tasks ORDER BY deadline ASC';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Gagal mengambil data tugas', error: err });
        }
        res.status(200).json(results);
    });
};

exports.updateTaskStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const query = 'UPDATE tasks SET status = ? WHERE id = ?';
    
    db.query(query, [status, id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Gagal memperbarui status tugas', error: err });
        }
        res.status(200).json({ message: 'Status tugas berhasil diperbarui' });
    });
};

exports.deleteTask = (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM tasks WHERE id = ?';
    
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Gagal menghapus tugas', error: err });
        }
        res.status(200).json({ message: 'Tugas berhasil dihapus' });
    });
};

exports.inviteMember = (req, res) => {
    const taskId = req.params.id;
    const { userId } = req.body; 

    const query = 'INSERT INTO task_members (task_id, user_id) VALUES (?, ?)';
    
    db.query(query, [taskId, userId], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: 'Anggota sudah ada di dalam tugas ini' });
            }
            return res.status(500).json({ message: 'Gagal menambahkan anggota', error: err });
        }
        res.status(201).json({ message: 'Anggota berhasil ditambahkan ke tugas' });
    });
};

exports.getTaskMembers = (req, res) => {
    const taskId = req.params.id;
    const query = `
        SELECT users.id, users.name, users.email 
        FROM users 
        JOIN task_members ON users.id = task_members.user_id 
        WHERE task_members.task_id = ?
    `;

    db.query(query, [taskId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Gagal mengambil data anggota', error: err });
        }
        res.status(200).json(results);
    });
};

exports.removeMember = (req, res) => {
    const taskId = req.params.id;
    const userId = req.params.userId;

    const query = 'DELETE FROM task_members WHERE task_id = ? AND user_id = ?';
    
    db.query(query, [taskId, userId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Gagal mengeluarkan anggota', error: err });
        }
        res.status(200).json({ message: 'Anggota berhasil dikeluarkan dari tugas' });
    });
};