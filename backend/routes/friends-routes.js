const express = require('express');
const router = express.Router();

// Pastikan import menggunakan destructuring object { }
const { getFriends, addFriend } = require('../controllers/friends-controller');
const verifyToken = require('../middlewares/auth-middleware');

router.get('/', verifyToken, getFriends);
router.post('/add', verifyToken, addFriend);

module.exports = router;