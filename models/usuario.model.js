const { db } = require('../services/db.server');
const { comparePassword } = require('../services/auth.service')

const usuarioModel = {
    getclient: async () => {
        const result = await db.many('SELECT * FROM client');
        return result;
    },
    login: async (correo) => {
        return await db.oneOrNone('SELECT * FROM client WHERE correo = $1', [correo]);
    },
    createUser: async (uuid, correo, password, step) => {
        // Retorna el resultado con RETURNING para obtener el uuid_client
        return await db.one('INSERT INTO client (uuid_client, correo, contrasena, nombre, apellidos, edad, telefono, etapa_registro ) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING uuid_client', [uuid, correo, password, '', '', 0, '', step]);
    },
    updateDataUser: async (uuid_client, nombre, apellidos, edad, telefono, step) => {
        return await db.none('UPDATE client SET nombre = $2, apellidos = $3, edad = $4, telefono = $5, etapa_registro = $6 WHERE uuid_client = $1', [uuid_client, nombre, apellidos, edad, telefono, step]);
    },
    getEmailUser: async (uuid_client) => {
        return await db.one('SELECT correo FROM client WHERE uuid_client = $1', [uuid_client]);
    },
    getPhoneUser: async (uuid_client) => {
        return await db.one('SELECT telefono FROM client WHERE uuid_client = $1', [uuid_client]);
    },
    updateVerificacionStepStatus: async (uuid_client, step) => {
        return await db.none('UPDATE client SET etapa_registro = $1 WHERE uuid_client = $2', [step, uuid_client]);
    },
    getVerificacionStepStatus: async (uuid_client) => {
        return await db.one('SELECT etapa_registro FROM client WHERE uuid_client = $1', [uuid_client]);
    },
    getPersonalDataUser: async (uuid_client) => {
        return await db.one('SELECT nombre, apellidos, correo, telefono FROM client WHERE uuid_client = $1', [uuid_client]);
    }, 
};

module.exports = usuarioModel;