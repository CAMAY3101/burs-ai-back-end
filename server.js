const express = require("express");
const cors = require('cors');
const dotenv = require('dotenv');
const { credential } = require("firebase-admin");

const app = express()
dotenv.config()

const port = process.env.PORT

app.use(express.json())
app.use(cors({
    origin: ["http://localhost:3000", "https://burs.com.mx"],
    credentials: true
}));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://burs.com.mx");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//Get principal
app.get('/', (req, res, next) => {
    //res.send('Pagina Principal Api ')
    res.json({ message: 'Hello World' })
})


//Familia de rutas
app.use(require('./routes/routes'))

//listen
app.listen(port, () => {
    console.log('Escuchando del puerto ' + port)
});