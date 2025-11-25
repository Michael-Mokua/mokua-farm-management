const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const { admin, db } = require('../config/firebase');
const generateToken = require('../utils/generateToken');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).limit(1).get();

    if (snapshot.empty) {
        res.status(401);
        throw new Error('Invalid email or password');
    }

    const userDoc = snapshot.docs[0];
    const user = { id: userDoc.id, ...userDoc.data() };

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Register a new user
// @route   POST /api/auth/register  
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role, phone } = req.body;

    // Check if user exists
    const usersRef = db.collection('users');
    const existingUser = await usersRef.where('email', '==', email).limit(1).get();

    if (!existingUser.empty) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const userData = {
        name,
        email,
        password: hashedPassword,
        role: role || 'viewer',
        phone: phone || '',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await usersRef.add(userData);

    res.status(201).json({
        _id: docRef.id,
        name,
        email,
        role: userData.role,
        token: generateToken(docRef.id),
    });
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const userDoc = await db.collection('users').doc(req.user.id).get();

    if (!userDoc.exists) {
        res.status(404);
        throw new Error('User not found');
    }

    const user = { id: userDoc.id, ...userDoc.data() };

    res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        bio: user.bio,
        profileImage: user.profileImage,
    });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const { name, email, phone, bio, profileImage } = req.body;

    const userRef = db.collection('users').doc(req.user.id);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
        res.status(404);
        throw new Error('User not found');
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (bio !== undefined) updateData.bio = bio;
    if (profileImage !== undefined) updateData.profileImage = profileImage;

    await userRef.update(updateData);

    const updated = await userRef.get();
    const user = { id: updated.id, ...updated.data() };

    res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        bio: user.bio,
        profileImage: user.profileImage,
    });
});

module.exports = {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
};
