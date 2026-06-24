const express = require('express');
const router = express.Router();
const {
    createGroup,
    getMyGroups,
    getGroupDetail,
    deleteGroup,
    addMember,
    leaveGroup,
    kickMember,
    getMessages,
    sendMessage
} = require('../controllers/group-controller');
const verifyToken = require('../middlewares/auth-middleware');

// --- GRUP ---
router.post('/', verifyToken, createGroup);
router.get('/', verifyToken, getMyGroups);
router.get('/:groupId', verifyToken, getGroupDetail);
router.delete('/:groupId', verifyToken, deleteGroup);

// --- ANGGOTA ---
router.post('/:groupId/members', verifyToken, addMember);
router.delete('/:groupId/members/leave', verifyToken, leaveGroup);
router.delete('/:groupId/members/:memberId', verifyToken, kickMember);

// --- PESAN (REST untuk load history) ---
router.get('/:groupId/messages', verifyToken, getMessages);
router.post('/:groupId/messages', verifyToken, sendMessage);

module.exports = router;