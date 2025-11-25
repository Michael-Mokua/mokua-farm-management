const asyncHandler = require('express-async-handler');
const { admin, db } = require('../config/firebase');

const getInventory = asyncHandler(async (req, res) => {
    const snapshot = await db.collection('inventory').where('userId', '==', req.user.id).get();
    const items = [];
    snapshot.forEach(doc => items.push({ _id: doc.id, ...doc.data() }));
    res.json(items);
});

const addInventoryItem = asyncHandler(async (req, res) => {
    const { itemName, category, quantity, unit, reorderLevel, costPerUnit, supplier } = req.body;
    const docRef = await db.collection('inventory').add({
        userId: req.user.id,
        itemName,
        category,
        quantity: quantity || 0,
        unit,
        reorderLevel: reorderLevel || 10,
        costPerUnit: costPerUnit || 0,
        supplier: supplier || '',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    const doc = await docRef.get();
    res.status(201).json({ _id: doc.id, ...doc.data() });
});

const updateInventoryItem = asyncHandler(async (req, res) => {
    const { itemName, category, quantity, unit, reorderLevel, costPerUnit, supplier } = req.body;
    const ref = db.collection('inventory').doc(req.params.id);
    const updateData = {};
    if (itemName) updateData.itemName = itemName;
    if (category) updateData.category = category;
    if (quantity !== undefined) updateData.quantity = quantity;
    if (unit) updateData.unit = unit;
    if (reorderLevel !== undefined) updateData.reorderLevel = reorderLevel;
    if (costPerUnit !== undefined) updateData.costPerUnit = costPerUnit;
    if (supplier) updateData.supplier = supplier;
    await ref.update(updateData);
    const doc = await ref.get();
    res.json({ _id: doc.id, ...doc.data() });
});

module.exports = { getInventory, addInventoryItem, updateInventoryItem };
