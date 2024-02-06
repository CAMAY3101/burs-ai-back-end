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

const verifyFirebaseEmailLink = async (userId, emailVerificationCode) => {
    // Verificar el enlace utilizando Firebase Auth
    await admin.auth().applyActionCode(emailVerificationCode);

    // Personaliza según tu lógica
};
module.exports = {
    generateFirebaseVerificationLink,
    createUserFirebaseAuth,
    verifyFirebaseEmailLink
};