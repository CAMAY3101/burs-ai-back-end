const {db} = require('../services/db.server')
const {generateFirebaseVerificationLink, createUserFirebaseAuth} = require('../services/firebase.auth')
const dotenv = require('dotenv')
const {sendEmail} = require('../services/sendgrid.config');
dotenv.config()

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
            const usuario = {
                nombre: req.body.nombre,
                apellidos: req.body.apellidos,
                edad: req.body.edad,
                correo: req.body.correo,
                telefono: req.body.telefono
            };

            // // Llamar a la función del modelo para agregar un usuario a la base de datos
            await usuarioModel.addUsuario(usuario.nombre, usuario.apellidos, usuario.edad, usuario.correo, usuario.telefono); 
            
            const userRecord = await createUserFirebaseAuth(usuario.correo);
            // Generar enlace de verificación de Firebase Auth
            const verificationLink = await generateFirebaseVerificationLink(usuario.correo);

            // Enviar correo electrónico con el enlace de verificación
            sendEmail(usuario.correo, verificationLink);

            res.json({ message: 'Usuario registrado con éxito' });

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