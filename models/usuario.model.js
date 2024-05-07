const { db } = require('../services/db.server');
const { comparePassword } = require('../services/auth.service')

const usuarioModel = {
    getUsuarios: async () => {
        const result = await db.many('SELECT * FROM usuarios');
        return result;
    },
    login: async (correo) => {
        return await db.oneOrNone('SELECT * FROM usuarios WHERE correo = $1', [correo]);
    },
    createUser: async (correo, password, step) => {
        // Retorna el resultado con RETURNING para obtener el id_usuario
        return await db.one('INSERT INTO usuarios (correo, contrasena, nombre, apellidos, edad, telefono, verificacion_step ) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id_usuario', [correo, password, '', '', 0, '', step]);
    },

    updateDataUser: async (id_usuario, nombre, apellidos, edad, telefono, step) => {
        return await db.none('UPDATE usuarios SET nombre = $2, apellidos = $3, edad = $4, telefono = $5, verificacion_step = $6 WHERE id_usuario = $1', [id_usuario, nombre, apellidos, edad, telefono, step]);
    },
    getEmailUser: async (id_usuario) => {
        return await db.one('SELECT correo FROM usuarios WHERE id_usuario = $1', [id_usuario]);
    },
    getPhoneUser: async (id_usuario) => {
        return await db.one('SELECT telefono FROM usuarios WHERE id_usuario = $1', [id_usuario]);
    },
    updateEmailVerificationStatus: async (userId, status, step) => {
        return await db.none('UPDATE usuarios SET correo_verificado = $1, verificacion_step = $2 WHERE id_usuario = $3', [status, step, userId]);
    },
    updatePhoneVerificationStatus: async (userId, status, step) => {
        return await db.none('UPDATE usuarios SET telefono_verificado = $1, verificacion_step = $2 WHERE id_usuario = $3', [status, step, userId]);
    },
    updateVerificacionStepStatus: async (userId, step) => {
        return await db.none('UPDATE usuarios SET verificacion_paso = $1 WHERE id_usuario = $2', [step, userId]);
    },
    getVerificacionStepStatus: async (userId) => {
        return await db.one('SELECT verificacion_paso FROM usuarios WHERE id_usuario = $1', [userId]);
    },
};

module.exports = usuarioModel;