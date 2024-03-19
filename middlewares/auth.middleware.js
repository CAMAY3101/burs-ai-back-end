const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config()

const authenticateJWT = (req, res, next) => {
    // Intentar obtener el token de una cookie
    let token = req.cookies.token;

    // Si el token no está en las cookies, intentar obtenerlo del encabezado Authorization
    if (!token && req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1]; // Bearer TOKEN
    }

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403); // Token no válido o expirado
            }
            req.user = user; // Adjuntar el payload del usuario al objeto de solicitud
            next();
        });
    } else {
        res.sendStatus(401); // No autorizado debido a la falta de token
    }
};

module.exports = authenticateJWT;
