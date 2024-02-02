const {db} = require('../services/db.server')
const admin = require('firebase-admin');
const dotenv = require('dotenv')
const transporter = require('../services/nodemailer.config');
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

            // Crear un usuario en Firebase Authentication
            const userRecord = await admin.auth().createUser({
                email: usuario.correo,
                emailVerified: false,
                disabled: false
            });

            await userRecord.toJSON(); // Esperar a que se cree el usuario

            const verificationLink = await admin.auth().generateEmailVerificationLink(userRecord.email);
            console.log(verificationLink);

            const mailOptions = {
                from: process.env.BURS_EMAIL,
                to: usuario.correo,
                subject: 'Verificación de Correo Electrónico',
                text: `Haz clic en el siguiente enlace para verificar tu correo electrónico en burs: ${verificationLink}`,
            };

            transporter.sendMail(mailOptions, function(err, data) {
                if(err) {
                    console.log("Error " + err);
                } else {
                    res.json("Email sent successfully");
                }
            });
            res.json({ message: 'Usuario agregado exitosamente. Se ha enviado un correo de verificación.' });

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