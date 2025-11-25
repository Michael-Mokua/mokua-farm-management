const asyncHandler = require('express-async-handler');
const { admin, db } = require('../config/firebase');

// Get user notifications
const getNotifications = asyncHandler(async (req, res) => {
    const snapshot = await db.collection('notifications')
        .where('userId', '==', req.user.id)
        .orderBy('createdAt', 'desc')
        .limit(20)
        .get();

    const notifications = [];
    snapshot.forEach(doc => notifications.push({ _id: doc.id, ...doc.data() }));
    res.json(notifications);
});

// Mark notification as read
const markAsRead = asyncHandler(async (req, res) => {
    const ref = db.collection('notifications').doc(req.params.id);
    await ref.update({ read: true });
    const doc = await ref.get();
    res.json({ _id: doc.id, ...doc.data() });
});

// Mark all as read
const markAllAsRead = asyncHandler(async (req, res) => {
    const snapshot = await db.collection('notifications')
        .where('userId', '==', req.user.id)
        .where('read', '==', false)
        .get();

    const batch = db.batch();
    snapshot.docs.forEach(doc => {
        batch.update(doc.ref, { read: true });
    });

    await batch.commit();
    res.json({ message: 'All notifications marked as read' });
});

// Delete notification
const deleteNotification = asyncHandler(async (req, res) => {
    await db.collection('notifications').doc(req.params.id).delete();
    res.json({ message: 'Notification removed' });
});

// Create notification (helper function for internal use)
const createNotification = async (userId, type, title, message, relatedId = null) => {
    try {
        await db.collection('notifications').add({
            userId,
            type,
            title,
            message,
            read: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            relatedId,
        });
    } catch (error) {
        console.error('Failed to create notification:', error);
    }
};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification,
};
