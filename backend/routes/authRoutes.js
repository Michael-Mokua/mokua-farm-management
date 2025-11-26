const express = require('express');
const router = express.Router();
const { authUser, registerUser, createUser, getUserProfile, updateUserProfile, getUsers } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/login', authUser);
// Disable public registration - only admins can create users
// router.post('/register', registerUser);
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.get('/users', protect, admin, getUsers);
router.post('/users/create', protect, admin, createUser);

module.exports = router;
