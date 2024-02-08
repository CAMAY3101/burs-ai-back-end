const {db} = require('../services/db.server')
const dotenv = require('dotenv')
const {sendEmail} = require('../services/sendgrid.config');
const twilioService = require('../services/twilio.service');
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

            await twilioService.sendOTP_Email(usuario.correo);

            // // Llamar a la función del modelo para agregar un usuario a la base de datos
            const usuarioDatabase = await usuarioModel.addUsuario(usuario.nombre, usuario.apellidos, usuario.edad, usuario.correo, usuario.telefono); 

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
    verifyEmail: async (req, res) => {
        try {
            const { email, code } = req.body;

            // Verificar el código de correo electrónico utilizando Twilio
            const verificationCheck = await twilioService.verifyEmail(email, code);

            if (verificationCheck.status === 'approved') {
                // Actualizar el estado de verificación en la base de datos
                await usuarioModel.updateEmailVerificationStatus(email, true);

                res.json({ message: 'Correo electrónico verificado con éxito' });
            } else {
                res.status(400).json({ error: 'La verificación del correo electrónico falló' });
            }
        } catch (error) {
            console.error("Error en verifyEmail de usuario.controller.js");
            console.error(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },
};
module.exports = usuarioController;