const { db } = require('../services/db.server')
const { hashPassword, comparePassword } = require('../services/auth.service');
const twilioService = require('../services/twilio.service');

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config()

const usuarioModel = require('../models/usuario.model');

const usuarioController = {
    getUsuarios: async (req, res) => {
        try {
            const result = await usuarioModel.getUsuarios();
            res.json(result);
        } catch (error) {
            console.log("Error en getUsuarios de usuario.controller.js");
            console.log(error);
            res.json({ error: error });
        }
    },
    login: async (req, res, next) => {
        try {
            const usuario = {
                correo: req.body.correo,
                contrasena: req.body.contrasena
            };
            console.log("login");
            console.log(usuario.correo);
            const userDB = await usuarioModel.login(usuario.correo);
            const unhashedPassword = await comparePassword(usuario.contrasena, userDB.contrasena);
            if (!userDB || !unhashedPassword) {
                console.log('Error en correo o contrasena incorrecto')
                const error = new Error('Correo o contraseña incorrectos');
                error.statusCode = 401;
                error.status = 'fail';
                return next(error);
            }

            const token = jwt.sign({ id_usuario: userDB.id_usuario },
                process.env.JWT_SECRET, {
                expiresIn: "1d"
            });

            // Configurar la cookie con el token
            res.cookie('token', token, {
                httpOnly: true,
                secure: false, // Solo en producción
                sameSite: 'None',
                maxAge: 24 * 60 * 60 * 1000, // Duración de 1 día
            });

            res.status(200).json({
                status: 'success',
                message: 'Inicio de sesión exitoso',
                progress: userDB.etapa_registro
            });

        } catch (error) {
            console.log("Error en login de usuario.controller.js");
            console.log(error);
            const serverError = new Error();
            serverError.statusCode = 500;
            serverError.status = 'error';
            return next(serverError);
        }
    },
    createUser: async (req, res, next) => {
        try {
            const usuario = {
                correo: req.body.correo,
                contrasena: req.body.contrasena
            };
            const hashedPassword = await hashPassword(usuario.contrasena);
            const newUserId = await usuarioModel.createUser(usuario.correo, hashedPassword, 'ingresar datos');

            const token = jwt.sign({ id_usuario: newUserId.id_usuario },
                process.env.JWT_SECRET, {
                expiresIn: "1d"
            });

            // Configurar la cookie con el token
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Solo en producción
                sameSite: 'None',
                maxAge: 24 * 60 * 60 * 1000 // Duración de 1 día
            });

            res.status(201).json({
                status: 'success',
                message: 'Usuario creado con éxito',
            });

        } catch (error) {
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
    logout: async (req, res, next) => {
        try {
            // Eliminar la cookie
            res.clearCookie('token', {
                httpOnly: true,
                secure: true, // asegúrate de que estás en una conexión HTTPS
                sameSite: 'none'
            });

            res.status(200).json({
                status: 'success',
                message: 'Cierre de sesión exitoso'
            });
        } catch (error) {
            console.log("Error en logout de usuario.controller.js");
            console.log(error);
            const serverError = new Error();
            serverError.statusCode = 500;
            serverError.status = 'error';
            next(serverError);
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

            await usuarioModel.updateDataUser(userId, usuario.nombre, usuario.apellidos, usuario.edad, usuario.telefono, 'ingresar historial');

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
    getSecureEmailUser: async (req, res, next) => {
        try {
            const userId = req.user.id_usuario;
            console.log('User id on getSecureEmail: ' + userId);
            const result = await usuarioModel.getEmailUser(userId);
            // add *** to email
            const email = result.correo.split('@');
            const emailSecure = email[0].slice(0, 3) + '***@' + email[1];
            res.status(200).json(
                {
                    status: 'success',
                    email: emailSecure
                }
            );
        } catch (error) {
            const errorGetEmail = new Error();
            errorGetEmail.statusCode = 500;
            errorGetEmail.status = 'error';
            next(errorGetEmail);
        }
    },
    getSecurePhoneUser: async (req, res, next) => {
        try {
            const userId = req.user.id_usuario;
            const result = await usuarioModel.getPhoneUser(userId);
            // add *** to phone
            const phoneSecure = result.telefono.slice(3, 5) + '***' + result.telefono.slice(-3);
            res.status(200).json(
                {
                    status: 'success',
                    phone: phoneSecure
                }
            );
        } catch (error) {
            const errorGetPhone = new Error();
            errorGetPhone.statusCode = 500;
            errorGetPhone.status = 'error';
            next(errorGetPhone);
        }
    },

    getVerificacionStepStatus: async (req, res, next) => {
        try {
            const userId = req.user.id_usuario;
            const result = await usuarioModel.getVerificacionStepStatus(userId);
            res.status(200).json(
                {
                    status: 'success',
                    verificatioStep: result
                }
            );
        } catch (error) {
            const errorGetStep = new Error();
            errorGetStep.statusCode = 500;
            errorGetStep.status = 'error';
            next(errorGetStep);
        }
    },
};
module.exports = usuarioController;