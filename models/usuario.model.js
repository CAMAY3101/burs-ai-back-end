const {db} = require('../services/db.server');

const usuarioModel = {
    getUsuarios: () => {
        const result = db.many('SELECT * FROM usuarios');
        return result;
    },
    addUsuario: (nombre, apellidos, edad, correo, telefono) => {
        return db.none('INSERT INTO usuarios(nombre, apellidos, edad, correo, telefono) VALUES($1, $2, $3, $4, $5)', [nombre, apellidos, edad, correo, telefono]);
    },
};

module.exports = usuarioModel;