const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth-controller');
const taskController = require('../controllers/task-controller');
const authMiddleware = require('../middlewares/auth-middleware');

router.post('/register', authController.register);
router.post('/login', authController.login);

router.post('/tasks', authMiddleware, taskController.createTask);
router.get('/tasks', authMiddleware, taskController.getAllTasks);
router.put('/tasks/:id/status', authMiddleware, taskController.updateTaskStatus);
router.delete('/tasks/:id', authMiddleware, taskController.deleteTask);
router.post('/tasks/:id/members', authMiddleware, taskController.inviteMember);
router.get('/tasks/:id/members', authMiddleware, taskController.getTaskMembers);
router.delete('/tasks/:id/members/:userId', authMiddleware, taskController.removeMember);

module.exports = router;