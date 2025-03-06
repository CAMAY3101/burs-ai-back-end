const express = require('express')
const router = express.Router()
const authenticateJWT = require('../middlewares/auth.middleware');

router.use('/usuarios', require('./usuario.router'))
router.use('/historial', require('./historial.router'))
router.use('/verificacion', require('./verificacion.router'))
router.use('/direccion', require('./direccion.router'))
router.use('/modelos', require('./modelos.router'))
router.use('/FAD', authenticateJWT, require('./FAD.router'))
router.use('/STP', require('./STP.router'))
router.use('/circulocredito', authenticateJWT, require('./circulocredito.router'))

router.get('/check-cookie', (req, res) => {
    try {
        // Verificar si las cookies 'token' y 'access_token' están presentes en la solicitud
        const tokenExist = Boolean(req.cookies.token);
        const accessTokenExist = Boolean(req.cookies.access_token);

        // Enviar una respuesta con el estado de ambas cookies
        res.json({
            tokenExist: tokenExist,
            accessTokenExist: accessTokenExist
        });
    } catch (error) {
        console.log("Error en check-cookie");
        console.log(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});


module.exports = router;
