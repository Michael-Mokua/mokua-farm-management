const asyncHandler = require('express-async-handler');
const { admin, db } = require('../config/firebase');

// @desc    Get all crops
// @route   GET /api/crops
// @access  Private
const getCrops = asyncHandler(async (req, res) => {
    const cropsRef = db.collection('crops');
    const snapshot = await cropsRef.where('userId', '==', req.user.id).get();

    const crops = [];
    snapshot.forEach(doc => {
        crops.push({ _id: doc.id, ...doc.data() });
    });

    res.json(crops);
});

// @desc    Create a crop
// @route   POST /api/crops
// @access  Private
const createCrop = asyncHandler(async (req, res) => {
    const {
        name,
        variety,
        fieldLocation,
        plantingDate,
        expectedHarvestDate,
    } = req.body;

    const cropData = {
        userId: req.user.id,
        name,
        variety: variety || '',
        fieldLocation,
        plantingDate,
        expectedHarvestDate: expectedHarvestDate || null,
        status: 'planted',
        logs: [],
        harvests: [],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('crops').add(cropData);

    res.status(201).json({ _id: docRef.id, ...cropData });
});

// @desc    Get crop by ID
// @route   GET /api/crops/:id
// @access  Private
const getCropById = asyncHandler(async (req, res) => {
    const cropDoc = await db.collection('crops').doc(req.params.id).get();

    if (!cropDoc.exists) {
        res.status(404);
        throw new Error('Crop not found');
    }

    res.json({ _id: cropDoc.id, ...cropDoc.data() });
});

// @desc    Update crop
// @route   PUT /api/crops/:id
// @access  Private
const updateCrop = asyncHandler(async (req, res) => {
    const {
        name,
        variety,
        fieldLocation,
        plantingDate,
        expectedHarvestDate,
        status,
    } = req.body;

    const cropRef = db.collection('crops').doc(req.params.id);
    const cropDoc = await cropRef.get();

    if (!cropDoc.exists) {
        res.status(404);
        throw new Error('Crop not found');
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (variety) updateData.variety = variety;
    if (fieldLocation) updateData.fieldLocation = fieldLocation;
    if (plantingDate) updateData.plantingDate = plantingDate;
    if (expectedHarvestDate) updateData.expectedHarvestDate = expectedHarvestDate;
    if (status) updateData.status = status;

    await cropRef.update(updateData);

    const updated = await cropRef.get();
    res.json({ _id: updated.id, ...updated.data() });
});

// @desc    Add log to crop
// @route   POST /api/crops/:id/log
// @access  Private
const addCropLog = asyncHandler(async (req, res) => {
    const { type, description, data } = req.body;

    const cropRef = db.collection('crops').doc(req.params.id);
    const cropDoc = await cropRef.get();

    if (!cropDoc.exists) {
        res.status(404);
        throw new Error('Crop not found');
    }

    const log = {
        date: admin.firestore.FieldValue.serverTimestamp(),
        type,
        description,
        data: data || {},
    };

    await cropRef.update({
        logs: admin.firestore.FieldValue.arrayUnion(log)
    });

    res.status(201).json({ message: 'Log added' });
});

// @desc    Add harvest to crop
// @route   POST /api/crops/:id/harvest
// @access  Private
const addCropHarvest = asyncHandler(async (req, res) => {
    const { quantity, revenue, notes } = req.body;

    const cropRef = db.collection('crops').doc(req.params.id);
    const cropDoc = await cropRef.get();

    if (!cropDoc.exists) {
        res.status(404);
        throw new Error('Crop not found');
    }

    const harvest = {
        date: admin.firestore.FieldValue.serverTimestamp(),
        quantity,
        revenue: revenue || 0,
        notes: notes || '',
    };

    await cropRef.update({
        harvests: admin.firestore.FieldValue.arrayUnion(harvest)
    });

    res.status(201).json({ message: 'Harvest added' });
});

module.exports = {
    getCrops,
    createCrop,
    getCropById,
    updateCrop,
    addCropLog,
    addCropHarvest,
};
