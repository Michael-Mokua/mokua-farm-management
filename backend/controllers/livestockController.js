const asyncHandler = require('express-async-handler');
const { admin, db } = require('../config/firebase');

const getLivestock = asyncHandler(async (req, res) => {
    const snapshot = await db.collection('livestock').where('userId', '==', req.user.id).get();
    const livestock = [];
    snapshot.forEach(doc => livestock.push({ _id: doc.id, ...doc.data() }));
    res.json(livestock);
});

const createLivestock = asyncHandler(async (req, res) => {
    const { tagId, name, type, breed, dob } = req.body;
    const docRef = await db.collection('livestock').add({
        userId: req.user.id,
        tagId,
        name: name || '',
        type,
        breed: breed || '',
        dob: dob || null,
        status: 'active',
        healthRecords: [],
        productionLogs: [],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    const doc = await docRef.get();
    res.status(201).json({ _id: doc.id, ...doc.data() });
});

const getLivestockById = asyncHandler(async (req, res) => {
    const doc = await db.collection('livestock').doc(req.params.id).get();
    if (!doc.exists) {
        res.status(404);
        throw new Error('Livestock not found');
    }
    res.json({ _id: doc.id, ...doc.data() });
});

const updateLivestock = asyncHandler(async (req, res) => {
    const { tagId, name, type, breed, dob, status } = req.body;
    const ref = db.collection('livestock').doc(req.params.id);
    const updateData = {};
    if (tagId) updateData.tagId = tagId;
    if (name) updateData.name = name;
    if (type) updateData.type = type;
    if (breed) updateData.breed = breed;
    if (dob) updateData.dob = dob;
    if (status) updateData.status = status;
    await ref.update(updateData);
    const doc = await ref.get();
    res.json({ _id: doc.id, ...doc.data() });
});

const addHealthRecord = asyncHandler(async (req, res) => {
    const { type, description, cost, nextDueDate } = req.body;
    const ref = db.collection('livestock').doc(req.params.id);
    await ref.update({
        healthRecords: admin.firestore.FieldValue.arrayUnion({
            date: admin.firestore.FieldValue.serverTimestamp(),
            type,
            description,
            cost: cost || 0,
            nextDueDate: nextDueDate || null,
        })
    });
    res.status(201).json({ message: 'Health record added' });
});

const addProductionLog = asyncHandler(async (req, res) => {
    const { type, quantity, unit, revenue } = req.body;
    const ref = db.collection('livestock').doc(req.params.id);
    await ref.update({
        productionLogs: admin.firestore.FieldValue.arrayUnion({
            date: admin.firestore.FieldValue.serverTimestamp(),
            type,
            quantity,
            unit,
            revenue: revenue || 0,
        })
    });
    res.status(201).json({ message: 'Production log added' });
});

module.exports = { getLivestock, createLivestock, getLivestockById, updateLivestock, addHealthRecord, addProductionLog };
