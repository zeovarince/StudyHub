const express = require('express');
const router = express.Router();
const {
    searchUsers,
    sendFriendRequest,
    getIncomingRequests,
    respondFriendRequest,
    getFriends,
    removeFriend
} = require('../controllers/friends-controller');
const verifyToken = require('../middlewares/auth-middleware');

// Urutan penting: statis (/search, /requests) harus sebelum dinamis (/:friendId)
router.get('/search', verifyToken, searchUsers);
router.get('/requests', verifyToken, getIncomingRequests);
router.get('/', verifyToken, getFriends);
router.post('/request', verifyToken, sendFriendRequest);
router.put('/request/:id_pertemanan', verifyToken, respondFriendRequest);
router.delete('/:friendId', verifyToken, removeFriend);

module.exports = router;