const express = require('express');
const usuarioRouter = express.Router();

const usuarioController = require('../controllers/usuario.controller');

usuarioRouter.get('/getUsuarios', usuarioController.getUsuarios);
usuarioRouter.post('/createUser', usuarioController.createUser);

usuarioRouter.post('/updateDataUser', usuarioController.updateDataUser);
usuarioRouter.post('/resendOTPCodeEmail', usuarioController.resendCodeOTPEmail);
usuarioRouter.post('/verifyEmail', usuarioController.verifyEmail);
usuarioRouter.post('/resendOTPCodePhoneNumber', usuarioController.resendCodeOTPPhoneNumber);
usuarioRouter.post('/verifyPhoneNumber', usuarioController.verifyPhoneNumber);

module.exports = usuarioRouter; 