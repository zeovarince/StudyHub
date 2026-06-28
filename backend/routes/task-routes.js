const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task-controller');
const verifyToken = require('../middlewares/auth-middleware');

const upload = require('../middlewares/upload-middleware')
// Terapkan middleware verifyToken ke semua rute tugas (hanya user login yang bisa akses)
router.use(verifyToken);

router.post('/', upload.single('file'), taskController.createTask);
router.get('/', taskController.getAllTasks);
router.put('/:id/status', taskController.updateTaskStatus);
router.delete('/:id', taskController.deleteTask);

// Rute Anggota Tugas
router.post('/:id/members', taskController.inviteMember);
router.get('/:id/members', taskController.getTaskMembers);
router.delete('/:id/members/:userId', taskController.removeMember);

module.exports = router;