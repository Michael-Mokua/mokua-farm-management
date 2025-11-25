const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { db } = require('../config/firebase');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const secret = process.env.JWT_SECRET || 'dev-secret';
            const decoded = jwt.verify(token, secret);

            const userDoc = await db.collection('users').doc(decoded.id).get();

            if (!userDoc.exists) {
                res.status(401);
                throw new Error('User not found');
            }

            req.user = { id: userDoc.id, ...userDoc.data() };
            delete req.user.password;

            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as an admin');
    }
};

module.exports = { protect, admin };
