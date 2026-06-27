const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat-controller');

// Rute utama untuk menerima pesan dari frontend
router.post('/', chatController.sendMessage);

module.exports = router;