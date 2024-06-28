const twilioService = require('../services/twilio.service');
const usuarioModel = require('../models/usuario.model');

const verificacionModel = require('../models/verificacion.model');

const verificacionController = {
    sendOTPCodeEmail: async (req, res, next) => {
        try {
            const userId = req.user.id_usuario;

            const emailModel = await usuarioModel.getEmailUser(userId);
            await twilioService.sendOTP_Email(emailModel.correo);

            res.status(200).json({
                status: 'success',
                message: 'Código de verificación enviado con éxito'
            });

        } catch (error) {
            const errorSendEmail = new Error();
            errorSendEmail.statusCode = 500;
            errorSendEmail.status = 'error';
            console.log(error);
            next(errorSendEmail);
        }

    },
    sendOTPCodePhoneNumber: async (req, res, next) => {
        try {
            const userId = req.user.id_usuario;

            const phoneModel = await usuarioModel.getPhoneUser(userId);
            await twilioService.sendOTP_PhoneNumber(phoneModel.telefono);

            res.status(200).json({
                status: 'success',
                message: 'Código de verificación enviado con éxito'
            });

        } catch (error) {
            const errorSendPhone = new Error();
            errorSendPhone.statusCode = 500;
            errorSendPhone.status = 'error';
            next(errorSendPhone);
        }
    },
    resendOTPCodeEmail: async (req, res, next) => {
        try {
            console.log('Resend Email otp')
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

            const emailModel = await usuarioModel.getEmailUser(userId);

            const verificationCheck = await twilioService.verifyOTP_Email(emailModel.correo, usuario.code);

            if (verificationCheck.status === 'approved') {
                await usuarioModel.updateVerificacionStepStatus(userId, 'verificar telefono');

                res.status(200).json({
                    status: 'success',
                    message: 'Correo verificado con éxito'
                });
            }
            if (verificationCheck.valid === false) {
                const errorCodeEmail = new Error('El código de verificación es incorrecto');
                errorCodeEmail.statusCode = 400;
                errorCodeEmail.status = 'fail';
                next(errorCodeEmail);
            }
        } catch (error) {
            console.log(error);
            if (error.code === 20404) {
                const errorCodeEmail = new Error('Error en Twilio Serice');
                errorCodeEmail.statusCode = 400;
                errorCodeEmail.status = 'fail';
                next(errorCodeEmail);
            } else {
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

            const phoneModel = await usuarioModel.getPhoneUser(userId);

            const verificationCheck = await twilioService.verifyOTP_PhoneNumber(phoneModel.telefono, usuario.code);

            if (verificationCheck.status === 'approved') {
                await usuarioModel.updatePhoneVerificationStatus(userId, 'verificar identidad');

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
}

module.exports = verificacionController;