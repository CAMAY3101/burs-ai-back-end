const {db} = require('../database/db.server')

const usuarioModel = require('../models/usuario.model')

const usuarioController = {
    getUsuarios: async (req, res) => {
        try {
            const result = await usuarioModel.getUsuarios();
            res.json(result);
        } catch (error) {
            console.log("Error en getUsuarios de usuario.controller.js");
            console.log(error);
            res.json({error: error});
        }
    },
    addUsuario: async (req, res) => {
        try {
            const {nombre, apellidos, edad, correo, telefono} = req.body;
            await usuarioModel.addUsuario(nombre, apellidos, edad, correo, telefono);
            res.json({message: 'Usuario agregado exitosamente'});
        } catch (error) {
            if (error.code === '23505' && error.constraint === 'unique_correo') {
                // Manejar el error de correo electrónico duplicado
                res.status(400).json({ error: 'El correo electrónico ya está registrado' });
            } else {
                console.error(error);
                res.status(500).json({ error: 'Error interno del servidor' });
            }
        }
    },
};
module.exports = usuarioController;