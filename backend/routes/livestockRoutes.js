const express = require('express');
const router = express.Router();
const {
    getLivestock,
    createLivestock,
    getLivestockById,
    updateLivestock,
    addHealthRecord,
    addProductionLog,
} = require('../controllers/livestockController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getLivestock).post(protect, createLivestock);
router
    .route('/:id')
    .get(protect, getLivestockById)
    .put(protect, updateLivestock);
router.route('/:id/health').post(protect, addHealthRecord);
router.route('/:id/production').post(protect, addProductionLog);

module.exports = router;
