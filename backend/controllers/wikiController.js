const asyncHandler = require('express-async-handler');
const { db, admin } = require('../config/firebase');

// @desc    Get all articles
// @route   GET /api/wiki
// @access  Private
const getArticles = asyncHandler(async (req, res) => {
    const articlesRef = db.collection('wiki');
    const snapshot = await articlesRef.orderBy('createdAt', 'desc').get();

    const articles = [];
    snapshot.forEach(doc => {
        const data = doc.data();
        articles.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        });
    });

    res.json(articles);
});

// @desc    Create a new article
// @route   POST /api/wiki
// @access  Private
const createArticle = asyncHandler(async (req, res) => {
    const { title, category, content } = req.body;

    if (!title || !content) {
        res.status(400);
        throw new Error('Please provide title and content');
    }

    const newArticle = {
        title,
        category: category || 'General',
        content,
        author: req.user.name,
        authorId: req.user.id,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('wiki').add(newArticle);
    const doc = await docRef.get();

    res.status(201).json({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate().toISOString(),
    });
});

// @desc    Delete an article
// @route   DELETE /api/wiki/:id
// @access  Private
const deleteArticle = asyncHandler(async (req, res) => {
    const articleRef = db.collection('wiki').doc(req.params.id);
    const doc = await articleRef.get();

    if (!doc.exists) {
        res.status(404);
        throw new Error('Article not found');
    }

    await articleRef.delete();

    res.json({ id: req.params.id });
});

module.exports = {
    getArticles,
    createArticle,
    deleteArticle,
};
