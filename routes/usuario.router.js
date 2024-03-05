const express = require('express');
const usuarioRouter = express.Router();

const usuarioController = require('../controllers/usuario.controller');

usuarioRouter.get('/getUsuarios', usuarioController.getUsuarios);
usuarioRouter.post('/verifyEmail', usuarioController.verifyEmail);
usuarioRouter.post('/verifyPhoneNumber', usuarioController.verifyPhoneNumber);

usuarioRouter.post('/createUser', usuarioController.createUser);
usuarioRouter.post('/updateDataUser', usuarioController.updateDataUser);

module.exports = usuarioRouter; 