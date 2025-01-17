const { v4: uuidv4 } = require('uuid');
const {db} = require('../services/db.server');

const verificacionModel = {

    updateEmailVerificationStatus: async (userId, status) => {
        const uuid = uuidv4();
        return await db.none('INSERT INTO verification (uuid_verification, uuid_client, verificacion_correo) VALUES ($1, $2, $3)', [uuid, userId, status]);
    },
    updatePhoneVerificationStatus: async (userId, status) => {
        return await db.none('UPDATE verification SET verificacion_telefono = $1 WHERE uuid_client = $2', [status, userId]);
    },
    updateIdentityVerificationStatus: async (userId, status) => {
        return await db.none('UPDATE verification SET verificacion_identidad = $1 WHERE uuid_client = $2', [status, userId]);
    },
    updateIDVerificationStatus: async (userId, status) => {
        return await db.none('UPDATE verification SET verificacion_id = $1 WHERE uuid_client = $2', [status, userId]);
    }
};

module.exports = verificacionModel