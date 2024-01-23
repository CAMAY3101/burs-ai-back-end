const express = require("express");
const app = express()
const dotenv = require('dotenv')
dotenv.config()
const port = process.env.PORT

app.use(express.json())

// variables base de datos
const pgp = require('pg-promise')()
const db = pgp('postgres://postgres:m19m31a31@localhost:5432/dummy_test')

// test para comprobar la connecion a base de datos
db.query('SELECT * FROM historial')
    .then(result => {
        console.log('Resultado de la consulta:', result);
    })
    .catch(error => {
        console.error('Error en la consulta:', error);
    });

//Get principal
app.get('/', (req, res, next) => {
    res.send('Pagina Principal Api Clase')
    //res.json({message: 'Hello World'})
})

//listen
app.listen(port, () => {
    console.log('Escuchando del puerto ' + port)
});