const qs = require('qs');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');

const { db } = require('../services/db.server')
const { hashPassword, comparePassword } = require('../services/auth.service');
const twilioService = require('../services/twilio.service');

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

            const token = jwt.sign({ uuid_user: userDB.uuid_client },
                process.env.JWT_SECRET, {
                expiresIn: "1d"
            });

            // Configurar la cookie con el token
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Secure solo en producción
                sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // None en producción, Lax en desarrollo
                maxAge: 24 * 60 * 60 * 1000, // Duración de 1 día
            });

            if (userDB.etapa_registro === 'verificar identidad') {
                const params = qs.stringify({
                    grant_type: 'password',
                    username: process.env.FAD_EMAIL,
                    password: process.env.FAD_PASSWORD_ENCRYPT
                });

                const headers = {
                    'Authorization': 'Basic Wm1Ga0xXTXlZeTF3YjNKMFlXdz06TWpoa04yUTNNbUppWVRWbVpHTTBObVl4Wmpka1lXSmpZbVEyTmpBMVpEVXpaVFZoT1dNMVpHVTROakF4TldVeE9EWmtaV0ZpTnpNd1lUUm1ZelV5WWc9PQ==',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Cache-Control': 'no-cache'
                }

                // Realiza la petición al endpoint de token
                const response = await axios.post(
                    'https://uat.firmaautografa.com/authorization-server/oauth/token ',
                    params,
                    { headers }
                );

                const access_token = jwt.sign({ accessToken: response.data.access_token }, process.env.JWT_SECRET_FAD, {
                    expiresIn: "1d"
                });

                res.cookie('access_token', access_token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production', // Secure solo en producción
                    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // None en producción, Lax en desarrollo
                    maxAge: 24 * 60 * 60 * 1000, // Duración de 1 día
                });
            }

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
            if (!req.body.terms) {
              const error = new Error('Debes aceptar los términos y condiciones de uso');
              error.statusCode = 400;
              error.status = 'fail';
              return next(error);
            }
            const usuario = {
                correo: req.body.correo,
                contrasena: req.body.contrasena
            };
            const hashedPassword = await hashPassword(usuario.contrasena);
            const uuid = uuidv4(); 
            console.log('register uuid: ', uuid)
            const newUserId = await usuarioModel.createUser(uuid, usuario.correo, hashedPassword, 'ingresar datos');
           
            await usuarioModel.updateVerification(newUserId.uuid_client, true);


            const token = jwt.sign({ uuid_user: newUserId.uuid_client },
                process.env.JWT_SECRET, {
                expiresIn: "1d"
            });
            console.log('token: ', token);
            

            // Configurar la cookie con el token
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
                maxAge: 24 * 60 * 60 * 1000
            });

            res.status(201).json({
                status: 'success',
                message: 'Usuario creado con éxito',
            });

        } catch (error) {
            console.log("Error en createUser de usuario.controller.js");
            console.log(error);
            if (error.code === '23505' && error.constraint === 'client_correo_key') {
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
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', 
            });

            res.clearCookie('access_token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', 
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
            const userId = req.user.uuid_user;
            const usuario = {
                nombre: req.body.nombre,
                apellidos: req.body.apellidos,
                telefono: req.body.telefono,
                fecha_nacimiento: req.body.fecha_nacimiento,
                curp: req.body.curp,
                op_telefono: req.body.op_telefono
            };
            console.log('update data user')
            console.log('usuario: ', usuario)

            // Si userId esta vacio, enviar error
            if (!userId) {
                const errorUserId = new Error('El id del usuario no se ha encontrado');
                errorUserId.statusCode = 400;
                errorUserId.status = 'fail';
                next(errorUserId);
            }

            await usuarioModel.updateDataUser(userId, usuario.nombre, usuario.apellidos, usuario.telefono, 'ingresar historial', usuario.fecha_nacimiento, usuario.curp, usuario.op_telefono);

            res.status(202).json({
                status: 'success',
                message: 'Datos de usuario actualizados con éxito',
            });

        } catch (error) {
            const errorUpdate = new Error();
            errorUpdate.statusCode = 500;
            errorUpdate.status = 'error';
            errorUpdate.message = error;
            next(errorUpdate);
        }
    },
    getSecureEmailUser: async (req, res, next) => {
        try {
            const userId = req.user.uuid_user;
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
            const userId = req.user.uuid_user;
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
            const userId = req.user.uuid_user;
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