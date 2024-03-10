const {db} = require('../services/db.server');

const usuarioModel = {
    getUsuarios: async () => {
        const result = await db.many('SELECT * FROM usuarios');
        return result;
    },
    createUser: async (correo, password) => {
        // Retorna el resultado con RETURNING para obtener el id_usuario
        return await db.one('INSERT INTO usuarios (correo, contrasena, nombre, apellidos, edad, telefono) VALUES($1, $2, $3, $4, $5, $6) RETURNING id_usuario', [correo, password, '', '', 0, '']);
    },

    updateDataUser: async (id_usuario, nombre, apellidos, edad, telefono) => {
        return await  db.none('UPDATE usuarios SET nombre = $2, apellidos = $3, edad = $4, telefono = $5 WHERE id_usuario = $1', [id_usuario, nombre, apellidos, edad, telefono]);
    },
    getEmailUser: async (id_usuario) => {
        return await db.one('SELECT correo FROM usuarios WHERE id_usuario = $1', [id_usuario]);
    },
    getPhoneUser: async (id_usuario) => {
        return await db.one('SELECT telefono FROM usuarios WHERE id_usuario = $1', [id_usuario]);
    },
    updateEmailVerificationStatus: async (userId, status) => {
        return await db.none('UPDATE usuarios SET correo_verificado = $1 WHERE id_usuario = $2', [status, userId]);
    },
    updatePhoneVerificationStatus: async (userId, status) => {
        return await db.none('UPDATE usuarios SET telefono_verificado = $1 WHERE id_usuario = $2', [status, userId]);
    }
};

module.exports = usuarioModel;