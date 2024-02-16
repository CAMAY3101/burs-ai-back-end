const {db} = require('../services/db.server');

const usuarioModel = {
    getUsuarios: () => {
        const result = db.many('SELECT * FROM usuarios');
        return result;
    },
    addUsuario: (nombre, apellidos, edad, correo, telefono) => {
        return db.none('INSERT INTO usuarios(nombre, apellidos, edad, correo, telefono) VALUES($1, $2, $3, $4, $5)', [nombre, apellidos, edad, correo, telefono]);
    },
    updateEmailVerificationStatus: (userId, status) => {
        return db.none('UPDATE usuarios SET email_verified = $1 WHERE id = $2', [status, userId]);
    },
    createUser: (correo, password) => {
        return db.none('INSERT INTO usuarios (correo, contrasena, nombre, apellidos, edad, telefono) VALUES($1, $2, $3, $4, $5, $6)', [correo, password, '', '', 0, '']);
    }
};

module.exports = usuarioModel;