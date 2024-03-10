const {db} = require('../services/db.server')
const dotenv = require('dotenv')
const { hashPassword } = require('../services/auth.service');
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
    createUser: async (req, res, next) => {
        try{
            const usuario = {
                correo: req.body.correo,
                contrasena: req.body.contrasena
            };
            const hashedPassword = await hashPassword(usuario.contrasena);
            const result = await usuarioModel.createUser(usuario.correo, hashedPassword);
            
            res.status(201).json({ 
                status: 'success',
                message: 'Usuario creado con éxito',
                data: {
                    id_usuario: result.id_usuario
                }
            });

        }catch (error){
            if (error.code === '23505' && error.constraint === 'usuarios_correo_key') {
                const error = new Error('El correo electrónico ya esta registrado');
                error.statusCode = 400;
                error.status = 'fail';
                next(error);
            } else {
                const serverError = new Error('Error interno del servidor');
                serverError.statusCode = 500;
                serverError.status = 'error';
                next(serverError);
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

    verifyEmail: async (req, res, next) => {
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

                res.status(200).json({ 
                    status: 'success',
                    message: 'Correo verificado con éxito'
                });
                await twilioService.sendOTP_PhoneNumber(phoneModel.telefono);
            } 
        } catch (error) {
            if(error.code === 20404){
                const errorCodeEmail = new Error('El código de verificación es incorrecto');
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

                res.status(200).json({
                    status: 'success',
                    message: 'Telefono verificado con éxito'
                });
            }
        } catch (error) {
            if (error.code === 20404) {
                const errorCodePhone = new Error('El código de verificación es incorrecto');
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