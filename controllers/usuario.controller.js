const {db} = require('../services/db.server')
const { hashPassword } = require('../services/auth.service');
const twilioService = require('../services/twilio.service');

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
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
    createUser: async (req, res, next) => {
        try{
            const usuario = {
                correo: req.body.correo,
                contrasena: req.body.contrasena
            };
            const hashedPassword = await hashPassword(usuario.contrasena);
            const newUserId = await usuarioModel.createUser(usuario.correo, hashedPassword);

            const token = jwt.sign({ id_usuario: newUserId.id_usuario }, 
                process.env.JWT_SECRET, {
                expiresIn: "1d"
            });

            // Configurar la cookie con el token
            res.cookie('token', token, {
                httpOnly: true,
                //secure: true, // secure significa que solo se establecerá en conexiones HTTPS
                sameSite: 'strict', // sameSite significa que la cookie no se enviará en solicitudes de navegación cruzada
                maxAge: 24 * 60 * 60 * 1000 // Duración de 1 día
            });
            
            res.status(201).json({ 
                status: 'success',
                message: 'Usuario creado con éxito',
            });

        }catch (error){
            console.log("Error en createUser de usuario.controller.js");
            console.log(error);
            if (error.code === '23505' && error.constraint === 'usuarios_correo_key') {
                const error = new Error('El correo electrónico ya esta registrado');
                error.statusCode = 400;
                error.status = 'fail';
                next(error);
            } else {
                const serverError = new Error();
                serverError.statusCode = 500;
                serverError.status = 'error';
                next(serverError);
            }
        }
    },
    updateDataUser: async (req, res, next) => {
        try {
            const userId = req.user.id_usuario;
            const usuario = {
                nombre: req.body.nombre,
                apellidos: req.body.apellidos,
                edad: req.body.edad,
                telefono: req.body.telefono
            };

            // Si userId esta vacio, enviar error
            if (!userId) {
                const errorUserId = new Error('El id del usuario no se ha encontrado');
                errorUserId.statusCode = 400;
                errorUserId.status = 'fail';
                next(errorUserId);
            }

            await usuarioModel.updateDataUser(userId, usuario.nombre, usuario.apellidos, usuario.edad, usuario.telefono);
            const emailModel = await usuarioModel.getEmailUser(userId);

            await twilioService.sendOTP_Email(emailModel.correo);

            res.status(202).json({
                status: 'success',
                message: 'Datos de usuario actualizados con éxito',
            });

        } catch (error) {

            const errorUpdate = new Error();
            errorUpdate.statusCode = 500;
            errorUpdate.status = 'error';
            next(errorUpdate);
        }
    },
    resendOTPCodeEmail: async (req, res, next) => {
        try {
            const userId = req.user.id_usuario;
            const emailModel = await usuarioModel.getEmailUser(userId);
            await twilioService.sendOTP_Email(emailModel.correo);
            res.status(200).json({
                status: 'success',
                message: 'Código de verificación reenviado con éxito'
            });
        } catch (error) {
            const errorResendEmail = new Error();
            errorResendEmail.statusCode = 500;
            errorResendEmail.status = 'error';
            next(errorResendEmail);
        }
    },
    resendOTPCodePhoneNumber: async (req, res, next) => {
        try {
            const userId = req.user.id_usuario;
            const phoneModel = await usuarioModel.getPhoneUser(userId);
            await twilioService.sendOTP_PhoneNumber(phoneModel.telefono);
            res.status(200).json({
                status: 'success',
                message: 'Código de verificación reenviado con éxito'
            });
        } catch (error) {
            const errorResendPhone = new Error();
            errorResendPhone.statusCode = 500;  
            errorResendPhone.status = 'error';
            next(errorResendPhone);
        }
    },

    verifyEmail: async (req, res, next) => {
        try {
            const userId = req.user.id_usuario;
            const usuario = {
                code: req.body.code
            };
            console.log("Verify Email")
            console.log(userId);

            const emailModel = await usuarioModel.getEmailUser(userId);
            const phoneModel = await usuarioModel.getPhoneUser(userId);

            console.log(emailModel);
            console.log(phoneModel);

            const verificationCheck = await twilioService.verifyOTP_Email(emailModel.correo, usuario.code);
            console.log(verificationCheck);

            if (verificationCheck.status === 'approved') {
                await usuarioModel.updateEmailVerificationStatus(userId, true);

                res.status(200).json({ 
                    status: 'success',
                    message: 'Correo verificado con éxito'
                });
                await twilioService.sendOTP_PhoneNumber(phoneModel.telefono);
            }
            if (verificationCheck.valid === false) {
                const errorCodeEmail = new Error('El código de verificación es incorrecto');
                errorCodeEmail.statusCode = 400;
                errorCodeEmail.status = 'fail';
                next(errorCodeEmail);
            }
        } catch (error) {
            console.log(error);
            if(error.code === 20404){
                const errorCodeEmail = new Error('Error en Twilio Serice');
                errorCodeEmail.statusCode = 400;
                errorCodeEmail.status = 'fail';
                next(errorCodeEmail);
            }else{
                const errorVerifyEmail = new Error();
                errorVerifyEmail.statusCode = 500;
                errorVerifyEmail.status = 'error';
                next(errorVerifyEmail);
            }
        }
    },
    verifyPhoneNumber: async (req, res, next) => {
        try {
            const userId = req.user.id_usuario;
            const usuario = {
                code: req.body.code
            };
            console.log("Verify Phone")
            console.log(userId);

            const phoneModel = await usuarioModel.getPhoneUser(userId);
            console.log(phoneModel);

            const verificationCheck = await twilioService.verifyOTP_PhoneNumber(phoneModel.telefono, usuario.code);
            console.log(verificationCheck);

            if (verificationCheck.status === 'approved') {
                await usuarioModel.updatePhoneVerificationStatus(userId, true);

                res.status(200).json({
                    status: 'success',
                    message: 'Telefono verificado con éxito'
                });
            }
            if (verificationCheck.valid === false) {
                const errorCodeEmail = new Error('El código de verificación es incorrecto');
                errorCodeEmail.statusCode = 400;
                errorCodeEmail.status = 'fail';
                next(errorCodeEmail);
            }
        } catch (error) {
            if (error.code === 20404) {
                const errorCodePhone = new Error('Error en Twilio Serice');
                errorCodePhone.statusCode = 400;
                errorCodePhone.status = 'fail';
                next(errorCodePhone);
            } else {
                const errorVerifyPhone = new Error();
                errorVerifyPhone.statusCode = 500;
                errorVerifyPhone.status = 'error';
                next(errorVerifyPhone);
            }
        }
    },
};
module.exports = usuarioController;