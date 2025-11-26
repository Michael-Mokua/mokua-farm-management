const express = require('express');
const router = express.Router();
const { getContacts, createContact, deleteContact } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getContacts)
    .post(protect, createContact);

router.route('/:id')
    .delete(protect, deleteContact);

module.exports = router;
