const express = require('express');
const router = express.Router();
const { getArticles, createArticle, deleteArticle } = require('../controllers/wikiController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getArticles)
    .post(protect, createArticle);

router.route('/:id')
    .delete(protect, deleteArticle);

module.exports = router;
