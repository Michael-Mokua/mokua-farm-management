const asyncHandler = require('express-async-handler');
const { db, admin } = require('../config/firebase');

// @desc    Get all contacts
// @route   GET /api/contacts
// @access  Private
const getContacts = asyncHandler(async (req, res) => {
    const contactsRef = db.collection('contacts');
    const snapshot = await contactsRef.orderBy('name', 'asc').get();

    const contacts = [];
    snapshot.forEach(doc => {
        const data = doc.data();
        contacts.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        });
    });

    res.json(contacts);
});

// @desc    Create a new contact
// @route   POST /api/contacts
// @access  Private
const createContact = asyncHandler(async (req, res) => {
    const { name, type, phone, email, notes } = req.body;

    if (!name || !type) {
        res.status(400);
        throw new Error('Please provide name and type');
    }

    const newContact = {
        name,
        type, // 'Supplier' or 'Customer'
        phone: phone || '',
        email: email || '',
        notes: notes || '',
        createdBy: req.user.id,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('contacts').add(newContact);
    const doc = await docRef.get();

    res.status(201).json({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate().toISOString(),
    });
});

// @desc    Delete a contact
// @route   DELETE /api/contacts/:id
// @access  Private
const deleteContact = asyncHandler(async (req, res) => {
    const contactRef = db.collection('contacts').doc(req.params.id);
    const doc = await contactRef.get();

    if (!doc.exists) {
        res.status(404);
        throw new Error('Contact not found');
    }

    await contactRef.delete();

    res.json({ id: req.params.id });
});

module.exports = {
    getContacts,
    createContact,
    deleteContact,
};
