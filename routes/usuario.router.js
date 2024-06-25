const express = require('express');
const usuarioRouter = express.Router();
const authenticateJWT = require('../middlewares/auth.middleware');

const usuarioController = require('../controllers/usuario.controller');

usuarioRouter.get('/getUsuarios', usuarioController.getUsuarios);
usuarioRouter.post('/login', usuarioController.login);
usuarioRouter.post('/createUser', usuarioController.createUser);
usuarioRouter.post('/logout', usuarioController.logout);

usuarioRouter.post('/updateDataUser', authenticateJWT, usuarioController.updateDataUser);
// usuarioRouter.post('/resendOTPCodeEmail', authenticateJWT, usuarioController.resendOTPCodeEmail);
// usuarioRouter.post('/resendOTPCodePhoneNumber', authenticateJWT, usuarioController.resendOTPCodePhoneNumber);
// usuarioRouter.post('/verifyEmail', authenticateJWT, usuarioController.verifyEmail);
// usuarioRouter.post('/verifyPhoneNumber', authenticateJWT, usuarioController.verifyPhoneNumber);
//usuarioRouter.get('/getVerificacionStepStatus', authenticateJWT, usuarioController.getVerificacionStepStatus);
usuarioRouter.get('/getSecureEmailUser', authenticateJWT, usuarioController.getSecureEmailUser);
usuarioRouter.get('/getSecurePhoneUser', authenticateJWT, usuarioController.getSecurePhoneUser);

module.exports = usuarioRouter; 