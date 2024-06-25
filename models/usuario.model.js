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
        return await db.one('INSERT INTO usuarios (correo, contrasena, nombre, apellidos, edad, telefono, etapa_registro ) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id_usuario', [correo, password, '', '', 0, '', step]);
    },
    updateDataUser: async (id_usuario, nombre, apellidos, edad, telefono, step) => {
        return await db.none('UPDATE usuarios SET nombre = $2, apellidos = $3, edad = $4, telefono = $5, etapa_registro = $6 WHERE id_usuario = $1', [id_usuario, nombre, apellidos, edad, telefono, step]);
    },
    getEmailUser: async (id_usuario) => {
        return await db.one('SELECT correo FROM usuarios WHERE id_usuario = $1', [id_usuario]);
    },
    getPhoneUser: async (id_usuario) => {
        return await db.one('SELECT telefono FROM usuarios WHERE id_usuario = $1', [id_usuario]);
    },
    updateVerificacionStepStatus: async (userId, step) => {
        return await db.none('UPDATE usuarios SET etapa_registro = $1 WHERE id_usuario = $2', [step, userId]);
    },
    getVerificacionStepStatus: async (userId) => {
        return await db.one('SELECT etapa_registro FROM usuarios WHERE id_usuario = $1', [userId]);
    }, 
};

module.exports = usuarioModel;