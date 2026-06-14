const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.register = async (req, res) => {
    try {
        const { nama_lengkap, email, password } = req.body;
        if (!nama_lengkap || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Semua field wajib diisi'
            });
        }

        const [existingUser] = await db.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Email sudah terdaftar'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            `INSERT INTO users
            (nama_lengkap, email, password)
            VALUES (?, ?, ?)`,
            [nama_lengkap, email, hashedPassword]
        ); 

        res.status(201).json({
            success: true,
            message: 'Registrasi berhasil'
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email dan password wajib diisi'
            });
        }

        const [users] = await db.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Email tidak ditemukan'
            });
        }

        const user = users[0];

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Password salah'
            });
        }

        const token = jwt.sign(
        {
            id_user: user.id_user,
            nama_lengkap: user.nama_lengkap,
            email: user.email
        },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d'
            }
        );

        res.status(200).json({
            success: true,
            message: 'Login berhasil',
            token,
            user: {
                id_user: user.id_user,
                nama_lengkap: user.nama_lengkap,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};