const {db} = require('../services/db.server');

const verificacionModel = {

    updateEmailVerificationStatus: async (userId, status) => {
        return  await db.none('INSERT INTO verificacion correo_verificado = $1 WHERE id_usuario = $2', [status, userId]);
    },
    updatePhoneVerificationStatus: async (userId, status) => {
        return await db.none('UPDATE verificacion SET telefono_verificado = $1 WHERE id_usuario = $2', [status, userId]);
    },
};

module.exports = verificacionModel