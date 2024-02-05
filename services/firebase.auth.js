const admin = require('firebase-admin');
const credential = require('../serviceAccountKeyFirebase.json');

admin.initializeApp({
    credential: admin.credential.cert(credential)
});

const createUserFirebaseAuth = async (email) => {
    const userRecord = await admin.auth().createUser({
        email: email,
        emailVerified: false,
        disabled: false
    });
    return userRecord;
}
const generateFirebaseVerificationLink = async (email) => {
    //const userRecord = await admin.auth().getUserByEmail(email);
    const link = await admin.auth().generateEmailVerificationLink(email);
    return link;
};

module.exports = {
    generateFirebaseVerificationLink,
    createUserFirebaseAuth
};