import { initializeApp, getApps } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// Firebase configuration - these should be in your .env.local file
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

// Only initialize if config is provided and app hasn't been initialized
let app;
let storage;

try {
    if (!getApps().length && firebaseConfig.apiKey) {
        app = initializeApp(firebaseConfig);
        storage = getStorage(app);
    } else if (getApps().length) {
        app = getApps()[0];
        storage = getStorage(app);
    }
} catch (error) {
    console.warn('Firebase initialization skipped. Please configure Firebase in .env.local');
}

export { storage };
