const {db} = require('../services/db.server');

const usuarioModel = {
    getUsuarios: () => {
        const result = db.many('SELECT * FROM usuarios');
        return result;
    },
    createUser: (correo, password) => {
        // Retorna el resultado con RETURNING para obtener el id_usuario
        return db.one('INSERT INTO usuarios (correo, contrasena, nombre, apellidos, edad, telefono) VALUES($1, $2, $3, $4, $5, $6) RETURNING id_usuario', [correo, password, '', '', 0, '']);
    },

    updateDataUser: (id_usuario, nombre, apellidos, edad, telefono) => {
        return db.none('UPDATE usuarios SET nombre = $2, apellidos = $3, edad = $4, telefono = $5 WHERE id_usuario = $1', [id_usuario, nombre, apellidos, edad, telefono]);
    },
    getEmailUser: (id_usuario) => {
        return db.one('SELECT correo FROM usuarios WHERE id_usuario = $1', [id_usuario]);
    },
    getPhoneUser: (id_usuario) => {
        return db.one('SELECT telefono FROM usuarios WHERE id_usuario = $1', [id_usuario]);
    },
    updateEmailVerificationStatus: (userId, status) => {
        return db.none('UPDATE usuarios SET correo_verificado = $1 WHERE id_usuario = $2', [status, userId]);
    },
    updatePhoneVerificationStatus: (userId, status) => {
        return db.none('UPDATE usuarios SET telefono_verificado = $1 WHERE id_usuario = $2', [status, userId]);
    }
};

module.exports = usuarioModel;