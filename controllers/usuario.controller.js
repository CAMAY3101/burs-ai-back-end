const {db} = require('../services/db.server')
const dotenv = require('dotenv')
const twilioService = require('../services/twilio.service');
const bcrypt = require('bcrypt');
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
    createUser: async (req, res) => {
        try{
            const usuario = {
                correo: req.body.correo,
                contrasena: req.body.contrasena
            };
            // Encriptar
            hashPassword = await bcrypt.hash(usuario.contrasena, 12);
            
            // Crear el usuario en la base de datos
            const result = await usuarioModel.createUser(usuario.correo, hashPassword);
            res.json({ 
                message: 'Usuario creado con éxito', 
                id_usuario: result.id_usuario
            });

        }catch (error){
            if (error.code === '23505' && error.constraint === 'unique_correo') {
                res.status(400).json({ error: 'El correo electrónico ya está registrado' });
            } else {
                console.error(error);
                res.status(500).json({ error: 'Error interno del servidor' });
            }
        }
    },
    updateDataUser: async (req, res) => {
        try {
            const usuario = {
                id_usuario: req.body.id_usuario,
                nombre: req.body.nombre,
                apellidos: req.body.apellidos,
                edad: req.body.edad,
                telefono: req.body.telefono
            };

            await usuarioModel.updateDataUser(usuario.id_usuario, usuario.nombre, usuario.apellidos, usuario.edad, usuario.telefono);
            const emailModel = await usuarioModel.getEmailUser(usuario.id_usuario);

            await twilioService.sendOTP_Email(emailModel.correo);
            
            res.json({ message: 'Datos de usuario actualizados con éxito' });
        } catch (error) {
            console.error("Error en updateDataUser de usuario.controller.js");
            console.error(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },


    verifyEmail: async (req, res) => {
        try {
            const usuario = {
                id_usuario: req.body.id_usuario,
                code: req.body.code
            };

            const emailModel = await usuarioModel.getEmailUser(usuario.id_usuario);
            const phoneModel = await usuarioModel.getPhoneUser(usuario.id_usuario);

            const verificationCheck = await twilioService.verifyOTP_Email(emailModel.correo, usuario.code);

            if (verificationCheck.status === 'approved') {
                await usuarioModel.updateEmailVerificationStatus(usuario.id_usuario, true);

                res.json({ message: 'Correo electrónico verificado con éxito' });
                const otpResponse = await twilioService.sendOTP_PhoneNumber(phoneModel.telefono);
            } else {
                res.status(400).json({ error: 'La verificación del correo electrónico falló' });
            }
        } catch (error) {
            console.error("Error en verifyEmail de usuario.controller.js");
            console.error(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },
    verifyPhoneNumber: async (req, res) => {
        try {
            const usuario = {
                id_usuario: req.body.id_usuario,
                code: req.body.code
            };

            const phoneModel = await usuarioModel.getPhoneUser(usuario.id_usuario);

            const verificationCheck = await twilioService.verifyOTP_PhoneNumber(phoneModel.telefono, usuario.code);

            if (verificationCheck.status === 'approved') {
                await usuarioModel.updatePhoneVerificationStatus(usuario.id_usuario, true);

                res.json({ message: 'Telefono verificado con éxito' });
            } else {
                res.status(400).json({ error: 'La verificación del telefono falló' });
            }
        } catch (error) {
            console.error("Error en verifyPhoneNumber de usuario.controller.js");
            console.error(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },
};
module.exports = usuarioController;