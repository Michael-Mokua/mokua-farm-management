const asyncHandler = require('express-async-handler');
const { admin, db } = require('../config/firebase');

const getHouseActivities = asyncHandler(async (req, res) => {
    const snapshot = await db.collection('houseActivities').where('userId', '==', req.user.id).get();
    const activities = [];
    snapshot.forEach(doc => activities.push({ _id: doc.id, ...doc.data() }));
    res.json(activities);
});

const createHouseActivity = asyncHandler(async (req, res) => {
    const { name, type, schedule } = req.body;
    const docRef = await db.collection('houseActivities').add({
        userId: req.user.id,
        name,
        type,
        status: 'off',
        schedule: schedule || '',
        logs: [],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    const doc = await docRef.get();
    res.status(201).json({ _id: doc.id, ...doc.data() });
});

const updateActivityStatus = asyncHandler(async (req, res) => {
    const { status, description } = req.body;
    const ref = db.collection('houseActivities').doc(req.params.id);
    await ref.update({
        status,
        logs: admin.firestore.FieldValue.arrayUnion({
            date: admin.firestore.FieldValue.serverTimestamp(),
            action: `Status changed to ${status}`,
            description: description || '',
            userId: req.user.id,
        })
    });
    const doc = await ref.get();
    res.json({ _id: doc.id, ...doc.data() });
});

const updateHouseActivityConfig = asyncHandler(async (req, res) => {
    const { name, type } = req.body;
    const ref = db.collection('houseActivities').doc(req.params.id);
    const updateData = {};
    if (name) updateData.name = name;
    if (type) updateData.type = type;
    await ref.update(updateData);
    const doc = await ref.get();
    res.json({ _id: doc.id, ...doc.data() });
});

module.exports = { getHouseActivities, createHouseActivity, updateActivityStatus, updateHouseActivityConfig };
