const express = require('express');
const router = express.Router();
const {
    getFinanceRecords,
    addFinanceRecord,
} = require('../controllers/financeController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getFinanceRecords).post(protect, addFinanceRecord);

module.exports = router;
