const express = require('express');
const router = express.Router();
const { getProducts, createProduct, deleteProduct } = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getProducts) // Public route
    .post(protect, admin, createProduct); // Admin only

router.route('/:id')
    .delete(protect, admin, deleteProduct); // Admin only

module.exports = router;
