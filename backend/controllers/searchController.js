const asyncHandler = require('express-async-handler');
const { db } = require('../config/firebase');

const searchAll = asyncHandler(async (req, res) => {
    const { q, type } = req.query;

    if (!q) {
        return res.json([]);
    }

    const searchTerm = q.toLowerCase();
    const results = [];

    try {
        // Search crops
        if (!type || type === 'crops') {
            const cropsSnapshot = await db.collection('crops').where('userId', '==', req.user.id).get();
            cropsSnapshot.forEach(doc => {
                const data = doc.data();
                if (data.cropName?.toLowerCase().includes(searchTerm) ||
                    data.variety?.toLowerCase().includes(searchTerm)) {
                    results.push({
                        id: doc.id,
                        type: 'crop',
                        title: data.cropName,
                        subtitle: data.variety,
                        status: data.status,
                        link: `/dashboard/crops`
                    });
                }
            });
        }

        // Search livestock
        if (!type || type === 'livestock') {
            const livestockSnapshot = await db.collection('livestock').where('userId', '==', req.user.id).get();
            livestockSnapshot.forEach(doc => {
                const data = doc.data();
                if (data.name?.toLowerCase().includes(searchTerm) ||
                    data.tagId?.toLowerCase().includes(searchTerm) ||
                    data.breed?.toLowerCase().includes(searchTerm)) {
                    results.push({
                        id: doc.id,
                        type: 'livestock',
                        title: data.name || data.tagId,
                        subtitle: `${data.type} - ${data.breed}`,
                        status: data.status,
                        link: `/dashboard/livestock`
                    });
                }
            });
        }

        // Search tasks
        if (!type || type === 'tasks') {
            const tasksSnapshot = await db.collection('tasks').get();
            tasksSnapshot.forEach(doc => {
                const data = doc.data();
                if (data.title?.toLowerCase().includes(searchTerm) ||
                    data.description?.toLowerCase().includes(searchTerm)) {
                    results.push({
                        id: doc.id,
                        type: 'task',
                        title: data.title,
                        subtitle: data.description,
                        status: data.status,
                        link: `/dashboard/tasks`
                    });
                }
            });
        }

        // Search sales
        if (!type || type === 'sales') {
            const salesSnapshot = await db.collection('sales').where('userId', '==', req.user.id).get();
            salesSnapshot.forEach(doc => {
                const data = doc.data();
                if (data.itemName?.toLowerCase().includes(searchTerm) ||
                    data.buyer?.toLowerCase().includes(searchTerm)) {
                    results.push({
                        id: doc.id,
                        type: 'sale',
                        title: data.itemName,
                        subtitle: `${data.buyer} - KES ${data.totalAmount}`,
                        status: data.paymentStatus,
                        link: `/dashboard/sales`
                    });
                }
            });
        }

        res.json(results.slice(0, 20)); // Limit to 20 results
    } catch (error) {
        console.error('Search error:', error);
        res.json([]);
    }
});

module.exports = { searchAll };
