const express = require('express');
const usuarioRouter = express.Router();

const usuarioController = require('../controllers/usuario.controller');

usuarioRouter.get('/getUsuarios', usuarioController.getUsuarios);
usuarioRouter.post('/addUsuario', usuarioController.addUsuario);
usuarioRouter.post('/verifyEmail', usuarioController.verifyEmail);
usuarioRouter.post('/verifyPhoneNumber', usuarioController.verifyPhoneNumber);
//T04004-05	Crear end-point para crear usuario 
usuarioRouter.post('/createUser', usuarioController.createUser);

module.exports = usuarioRouter; 