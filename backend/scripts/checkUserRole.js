const { db } = require('../config/firebase');

async function checkUser(email) {
    try {
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('email', '==', email).limit(1).get();
        if (snapshot.empty) {
            console.log('User not found');
            return;
        }
        const userDoc = snapshot.docs[0];
        const data = userDoc.data();
        console.log(`User ${email} role: ${data.role}`);
    } catch (err) {
        console.error('Error:', err);
    }
}

checkUser('michaelcartelo03@gmail.com');
