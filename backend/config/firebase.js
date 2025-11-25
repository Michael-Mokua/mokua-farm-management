const admin = require('firebase-admin');
require('dotenv').config();

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // Production: Use environment variable
    try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } catch (error) {
        console.error('Error parsing FIREBASE_SERVICE_ACCOUNT:', error);
    }
} else {
    // Development: Use local file
    try {
        serviceAccount = require('../serviceAccountKey.json');
    } catch (error) {
        console.warn('serviceAccountKey.json not found and FIREBASE_SERVICE_ACCOUNT not set.');
    }
}

if (serviceAccount) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
} else {
    // Fallback for when no credentials are provided (might fail for some operations)
    admin.initializeApp();
}

const db = admin.firestore();

module.exports = { admin, db };
