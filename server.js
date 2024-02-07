const express = require("express");
const app = express()
const dotenv = require('dotenv')
dotenv.config()

const bodyParser = require('body-parser')
const twilioRouter = require('./routes/twilio-sms');
const jsonParser = bodyParser.json();

const port = process.env.PORT

app.use(express.json())

app.use(jsonParser); 
app.use('/twilio-sms', twilioRouter);


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