const express = require('express');
const usuarioRouter = express.Router();

const usuarioController = require('../controllers/usuario.controller');

usuarioRouter.get('/getUsuarios', usuarioController.getUsuarios);
usuarioRouter.post('/addUsuario', usuarioController.addUsuario);


module.exports = usuarioRouter; 