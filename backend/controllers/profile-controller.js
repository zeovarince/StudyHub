const db = require('../config/db');

const getProfile = async (req, res) => {
  const userId = req.user.id_user;

  const query = 'SELECT id_user, nama_lengkap, email, created_at FROM users WHERE id_user = ?';

  try {
    const [results] = await db.query(query, [userId]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    return res.status(200).json({ user: results[0] });
  } catch (err) {
    console.error('Gagal mengambil data profil:', err);
    return res.status(500).json({ message: 'Gagal mengambil data profil' });
  }
};

module.exports = { getProfile };