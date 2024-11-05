const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config()

const decodeFADToken = (req, res, next) => {
    // Intentar obtener el token de una cookie
    let access_token = req.cookies.access_token;

    // Si el token no está en las cookies, intentar obtenerlo del encabezado Authorization
    if (!access_token && req.headers.authorization) {
        access_token = req.headers.authorization.split(' ')[1]; // Bearer TOKEN
    }

    if (access_token) {
        jwt.verify(access_token, process.env.JWT_SECRET_FAD, (err, decodeFAD) => {
            if (err) {
                return res.sendStatus(403); // Token no válido o expirado
            }
            req.fad = decodeFAD; // Adjuntar el payload del usuario al objeto de solicitud
            next();
        });
    } else {
        res.sendStatus(401); // No autorizado debido a la falta de token
    }
};

module.exports = decodeFADToken;
