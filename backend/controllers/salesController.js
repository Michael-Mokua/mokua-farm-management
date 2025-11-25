const asyncHandler = require('express-async-handler');
const { admin, db } = require('../config/firebase');

// Get all sales
const getSales = asyncHandler(async (req, res) => {
    const snapshot = await db.collection('sales').where('userId', '==', req.user.id).get();
    const sales = [];
    snapshot.forEach(doc => sales.push({ _id: doc.id, ...doc.data() }));

    // Sort by date descending
    sales.sort((a, b) => {
        const dateA = a.saleDate?.toDate ? a.saleDate.toDate() : new Date(a.saleDate);
        const dateB = b.saleDate?.toDate ? b.saleDate.toDate() : new Date(b.saleDate);
        return dateB - dateA;
    });

    res.json(sales);
});

// Create new sale
const createSale = asyncHandler(async (req, res) => {
    const {
        type,
        itemName,
        quantity,
        unit,
        pricePerUnit,
        buyer,
        buyerContact,
        saleDate,
        paymentStatus,
        notes
    } = req.body;

    const totalAmount = quantity * pricePerUnit;

    const docRef = await db.collection('sales').add({
        userId: req.user.id,
        type,
        itemName,
        quantity: parseFloat(quantity),
        unit,
        pricePerUnit: parseFloat(pricePerUnit),
        totalAmount,
        buyer,
        buyerContact: buyerContact || '',
        saleDate: saleDate || admin.firestore.FieldValue.serverTimestamp(),
        paymentStatus: paymentStatus || 'paid',
        notes: notes || '',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const doc = await docRef.get();
    res.status(201).json({ _id: doc.id, ...doc.data() });
});

// Update sale
const updateSale = asyncHandler(async (req, res) => {
    const { paymentStatus, notes } = req.body;
    const ref = db.collection('sales').doc(req.params.id);

    const updateData = {};
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (notes !== undefined) updateData.notes = notes;

    await ref.update(updateData);
    const doc = await ref.get();
    res.json({ _id: doc.id, ...doc.data() });
});

// Delete sale
const deleteSale = asyncHandler(async (req, res) => {
    await db.collection('sales').doc(req.params.id).delete();
    res.json({ message: 'Sale removed' });
});

// Get sales analytics
const getSalesAnalytics = asyncHandler(async (req, res) => {
    const snapshot = await db.collection('sales').where('userId', '==', req.user.id).get();
    const sales = [];
    snapshot.forEach(doc => sales.push(doc.data()));

    const analytics = {
        totalRevenue: sales.reduce((sum, s) => sum + (s.totalAmount || 0), 0),
        totalSales: sales.length,
        paidSales: sales.filter(s => s.paymentStatus === 'paid').length,
        pendingSales: sales.filter(s => s.paymentStatus === 'pending').length,
        byType: {},
        recent: sales.slice(0, 5),
    };

    // Group by type
    sales.forEach(sale => {
        if (!analytics.byType[sale.type]) {
            analytics.byType[sale.type] = { count: 0, revenue: 0 };
        }
        analytics.byType[sale.type].count++;
        analytics.byType[sale.type].revenue += sale.totalAmount || 0;
    });

    res.json(analytics);
});

module.exports = {
    getSales,
    createSale,
    updateSale,
    deleteSale,
    getSalesAnalytics,
};
