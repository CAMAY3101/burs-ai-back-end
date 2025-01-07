const twilioService = require('../services/twilio.service');
const usuarioModel = require('../models/usuario.model');

const verificacionModel = require('../models/verificacion.model');

const verificacionController = {
    sendOTPCodeEmail: async (req, res, next) => {
        try {
            const userId = req.user.uuid_user;

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
            const userId = req.user.uuid_user;

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
            const userId = req.user.uuid_user;
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
            const userId = req.user.uuid_user;
            const phoneModel = await usuarioModel.getPhoneUser(userId);
            const responseTwilio = await twilioService.sendOTP_PhoneNumber(phoneModel.telefono);
            console.log(responseTwilio);
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
            const userId = req.user.uuid_user;
            const usuario = {
                code: req.body.code
            };

            const emailModel = await usuarioModel.getEmailUser(userId);

            const verificationCheck = await twilioService.verifyOTP_Email(emailModel.correo, usuario.code);

            if (verificationCheck.status === 'approved') {
                await usuarioModel.updateVerificacionStepStatus(userId, 'verificar telefono');
                await verificacionModel.updateEmailVerificationStatus(userId, true);

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
            const userId = req.user.uuid_user;
            const usuario = {
                code: req.body.code
            };

            console.log('Code phone', usuario.code);

            const phoneModel = await usuarioModel.getPhoneUser(userId);
            console.log('Phone model', phoneModel);

            const verificationCheck = await twilioService.verifyOTP_PhoneNumber(phoneModel.telefono, usuario.code);
            console.log('Verification check', verificationCheck);

            if (verificationCheck.status === 'approved') {
                await usuarioModel.updateVerificacionStepStatus(userId, 'verificar identidad');
                await verificacionModel.updateEmailVerificationStatus(userId, true);


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
            console.log(error)
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
    verifyIdentity: async (req, res, next) => {
        try{
            const userId = req.user.uuid_user;
            await verificacionModel.updateIdentityVerificationStatus(userId, true);
            await usuarioModel.updateVerificacionStepStatus(userId, 'verificar id');
            res.status(200).json({
                status: 'success',
                message: 'Identidad verificada con éxito'
            });
        }catch(error){
            console.log(error);
            const errorVerifyIdentity = new Error();
            errorVerifyIdentity.statusCode = 500;
            errorVerifyIdentity.status = 'error';
            next(errorVerifyIdentity);
        }
    },
    verifyID: async (req, res, next) => {
        try{
            const userId = req.user.uuid_user;
            await verificacionModel.updateIDVerificationStatus(userId, true);
            await usuarioModel.updateVerificacionStepStatus(userId, 'simulacion modelos');
            res.status(200).json({
                status: 'success',
                message: 'Identificación verificada con éxito'
            });
        }catch(error){
            console.log(error);
            const errorVerifyID = new Error();
            errorVerifyID.statusCode = 500;
            errorVerifyID.status = 'error';
            next(errorVerifyID);
        }
    }
}

module.exports = verificacionController;