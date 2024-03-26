const express = require("express");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv').config();
const errorHandler = require('./middlewares/errorHandler');

const {db} = require('./services/db.server');

const port = process.env.PORT

const app = express();1

app.use(cookieParser());
app.use(express.json());

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
    try{
        const result = db.query('SELECT NOW()');
        res.json({result})
    }catch (error){
        console.log("Error en get principal");
        console.log(error);
        res.json({error: error});
    }
})


//Familia de rutas
app.use(require('./routes/routes'))

//listen
app.listen(port, () => {
    console.log('Escuchando del puerto ' + port)
});

// middleware para manejar errores
app.use(errorHandler);