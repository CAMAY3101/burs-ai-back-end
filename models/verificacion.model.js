const {db} = require('../services/db.server');

const verificacionModel = {

    updateEmailVerificationStatus: async (userId, status) => {
        return await db.none('INSERT INTO verificacion (id_usuario, verificacion_correo) VALUES ($1, $2)', [userId, status]);
    },
    updatePhoneVerificationStatus: async (userId, status) => {
        return await db.none('UPDATE verificacion SET verificacion_telefono = $1 WHERE id_usuario = $2', [status, userId]);
    },
};

module.exports = verificacionModel