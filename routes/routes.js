const express = require('express')
const router = express.Router()

router.use('/usuarios', require('./usuario.router'))
router.use('/historial', require('./historial.router'))
router.use('/verificacion', require('./verificacion.router'))
router.use('/direccion', require('./direccion.router'))

router.get('/check-cookie', (req, res) => {
    try {
        // Verificar si la cookie está presente en la solicitud
        if (req.cookies.token) {
            // La cookie está presente, enviar una respuesta con un indicador de éxito
            res.json({ tokenExist: true });
        } else {
            // La cookie no está presente, enviar una respuesta con un indicador de fallo
            res.json({ tokenExist: false });
        }
    } catch (error) {
        console.log("Error en check-cookie");
        console.log(error);
        res.json({ error: error });
    }
});

module.exports = router;