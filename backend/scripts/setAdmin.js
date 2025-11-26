const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json');

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function setAdmin(email) {
    try {
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('email', '==', email).limit(1).get();

        if (snapshot.empty) {
            console.log(`No user found with email: ${email}`);
            console.log('Please register first, then run this script.');
            process.exit(1);
        }

        const userDoc = snapshot.docs[0];
        await userDoc.ref.update({ role: 'admin' });

        console.log(`✅ Successfully set ${email} as admin!`);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

// Set your email as admin
setAdmin('michaelcartelo03@gmail.com');
