const express = require('express');
const router = express.Router();
const {
    getCrops,
    createCrop,
    getCropById,
    updateCrop,
    addCropLog,
    addCropHarvest,
} = require('../controllers/cropController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getCrops).post(protect, createCrop);
router
    .route('/:id')
    .get(protect, getCropById)
    .put(protect, updateCrop);
router.route('/:id/log').post(protect, addCropLog);
router.route('/:id/harvest').post(protect, addCropHarvest);

module.exports = router;
