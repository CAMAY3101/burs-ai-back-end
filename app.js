const express = require("express");
const app = express()
const dotenv = require('dotenv')
dotenv.config()
const port = process.env.PORT

app.use(express.json())



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