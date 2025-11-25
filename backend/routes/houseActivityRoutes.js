const express = require('express');
const router = express.Router();
const {
    getHouseActivities,
    createHouseActivity,
    updateActivityStatus,
    updateHouseActivityConfig,
} = require('../controllers/houseActivityController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getHouseActivities).post(protect, createHouseActivity);
router.put('/:id/status', protect, updateActivityStatus);
router.put('/:id/config', protect, updateHouseActivityConfig);

module.exports = router;
