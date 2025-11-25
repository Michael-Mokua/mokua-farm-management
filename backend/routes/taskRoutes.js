const express = require('express');
const router = express.Router();
const {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    assignTask,
    completeTask
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getTasks).post(protect, createTask);
router.route('/:id').put(protect, updateTask).delete(protect, deleteTask);
router.put('/:id/assign', protect, assignTask);
router.put('/:id/complete', protect, completeTask);

module.exports = router;
