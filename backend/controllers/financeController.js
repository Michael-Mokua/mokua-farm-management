const asyncHandler = require('express-async-handler');
const { admin, db } = require('../config/firebase');

const getFinanceRecords = asyncHandler(async (req, res) => {
    const snapshot = await db.collection('finance').where('userId', '==', req.user.id).get();
    const records = [];
    snapshot.forEach(doc => records.push({ _id: doc.id, ...doc.data() }));

    // Sort by date on the server side
    records.sort((a, b) => {
        const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date);
        const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date);
        return dateB - dateA;
    });

    res.json(records);
});

const addFinanceRecord = asyncHandler(async (req, res) => {
    const { type, category, amount, date, description, receiptImage } = req.body;
    const docRef = await db.collection('finance').add({
        userId: req.user.id,
        type,
        category,
        amount: parseFloat(amount),
        date: date || new Date().toISOString(),
        description: description || '',
        receiptImage: receiptImage || null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    const doc = await docRef.get();
    res.status(201).json({ _id: doc.id, ...doc.data() });
});

module.exports = { getFinanceRecords, addFinanceRecord };
