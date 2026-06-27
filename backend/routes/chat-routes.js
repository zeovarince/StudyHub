const express = require('express');
const router = express.Router();
const {
    sendChatMessage,
    getChatHistory,
    clearChatHistory
} = require('../controllers/chat-controller');
const verifyToken = require('../middlewares/auth-middleware');

// Semua endpoint chat wajib login
router.use(verifyToken);

router.get('/history', getChatHistory);
router.delete('/history', clearChatHistory);
router.post('/', sendChatMessage);

module.exports = router;
