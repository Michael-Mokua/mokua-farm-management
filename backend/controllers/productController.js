const asyncHandler = require('express-async-handler');
const { db, admin } = require('../config/firebase');

// @desc    Get all products (Public)
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const productsRef = db.collection('products');
    const snapshot = await productsRef.get();

    const products = [];
    snapshot.forEach(doc => {
        const data = doc.data();
        products.push({
            id: doc.id,
            ...data,
        });
    });

    res.json(products);
});

// @desc    Create a new product (Admin)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const { name, price, image, stock, description } = req.body;

    if (!name || !price) {
        res.status(400);
        throw new Error('Please provide name and price');
    }

    const newProduct = {
        name,
        price: Number(price),
        image: image || '',
        stock: Number(stock) || 0,
        description: description || '',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('products').add(newProduct);
    const doc = await docRef.get();

    res.status(201).json({
        id: doc.id,
        ...doc.data(),
    });
});

// @desc    Delete a product (Admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const productRef = db.collection('products').doc(req.params.id);
    const doc = await productRef.get();

    if (!doc.exists) {
        res.status(404);
        throw new Error('Product not found');
    }

    await productRef.delete();

    res.json({ id: req.params.id });
});

module.exports = {
    getProducts,
    createProduct,
    deleteProduct,
};
