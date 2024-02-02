const express = require("express");
const app = express()
const dotenv = require('dotenv')
dotenv.config()
const port = process.env.PORT

app.use(express.json())

const admin = require('firebase-admin');
const credential = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(credential)
});
app.get('/getInfo', (req, res, next) => {
    const email = 'creyesa18@gmail.com';
    admin.auth()
        .getUserByEmail(email)
        .then((userRecord) => {
            // See the UserRecord reference doc for the contents of userRecord.
            console.log(`Successfully fetched user data: ${userRecord.toJSON()}`);
            res.json({ success: true, message: 'Successfully fetched user data', userRecord: userRecord.toJSON() });
        })
        .catch((error) => {
            console.log('Error fetching user data:', error);
            res.status(500).json({ success: false, message: 'Error fetching user data', error: error.message });
        });
})

//Get principal
app.get('/', (req, res, next) => {
    res.send('Pagina Principal Api ')
    res.json({message: 'Hello World'})
})


//Familia de rutas
app.use(require('./routes/routes'))

//listen
app.listen(port, () => {
    console.log('Escuchando del puerto ' + port)
});