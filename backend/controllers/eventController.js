const asyncHandler = require('express-async-handler');
const { db, admin } = require('../config/firebase');

// @desc    Get all events
// @route   GET /api/events
// @access  Private
const getEvents = asyncHandler(async (req, res) => {
    const eventsRef = db.collection('events');
    const snapshot = await eventsRef.get();

    const events = [];
    snapshot.forEach(doc => {
        const data = doc.data();
        events.push({
            id: doc.id,
            ...data,
            // Convert Firestore timestamps to ISO strings for frontend
            start: data.start?.toDate?.()?.toISOString() || data.start,
            end: data.end?.toDate?.()?.toISOString() || data.end,
        });
    });

    res.json(events);
});

// @desc    Create a new event
// @route   POST /api/events
// @access  Private
const createEvent = asyncHandler(async (req, res) => {
    const { title, start, end, type, description } = req.body;

    if (!title || !start) {
        res.status(400);
        throw new Error('Please provide title and start date');
    }

    const newEvent = {
        title,
        start: new Date(start),
        end: end ? new Date(end) : new Date(start),
        type: type || 'general',
        description: description || '',
        createdBy: req.user.id,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('events').add(newEvent);
    const doc = await docRef.get();

    res.status(201).json({
        id: doc.id,
        ...doc.data(),
        start: doc.data().start.toDate().toISOString(),
        end: doc.data().end.toDate().toISOString(),
    });
});

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private
const deleteEvent = asyncHandler(async (req, res) => {
    const eventRef = db.collection('events').doc(req.params.id);
    const doc = await eventRef.get();

    if (!doc.exists) {
        res.status(404);
        throw new Error('Event not found');
    }

    await eventRef.delete();

    res.json({ id: req.params.id });
});

module.exports = {
    getEvents,
    createEvent,
    deleteEvent,
};
