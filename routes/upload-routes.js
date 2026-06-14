const express = require('express');
const router = express.Router();

const upload = require('../middlewares/upload-middleware');

router.post(
    '/file',
    upload.single('file'),
    (req, res) => {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'File tidak ditemukan'
            });
        }

        res.status(200).json({
            success: true,
            message: 'File berhasil diupload',
            filename: req.file.filename
        });
    }
);

module.exports = router;