const express = require('express');
const usuarioRouter = express.Router();
const authenticateJWT = require('../middlewares/auth.middleware');

const usuarioController = require('../controllers/usuario.controller');

usuarioRouter.get('/getUsuarios', usuarioController.getUsuarios);
usuarioRouter.post('/login', usuarioController.login);
usuarioRouter.post('/createUser', usuarioController.createUser);
usuarioRouter.post('/logout', usuarioController.logout);

usuarioRouter.post('/updateDataUser', authenticateJWT, usuarioController.updateDataUser);
usuarioRouter.get('/getVerificacionStepStatus', authenticateJWT, usuarioController.getVerificacionStepStatus);
usuarioRouter.get('/getSecureEmailUser', authenticateJWT, usuarioController.getSecureEmailUser);
usuarioRouter.get('/getSecurePhoneUser', authenticateJWT, usuarioController.getSecurePhoneUser);

// Nuevas rutas para ABCM
usuarioRouter.post('/admin/createUser', authenticateJWT, usuarioController.adminCreateUser); // Alta
usuarioRouter.put('/admin/updateUser/:uuid', authenticateJWT, usuarioController.adminUpdateUser); // Modificación
usuarioRouter.delete('/admin/deleteUser/:uuid', authenticateJWT, usuarioController.adminDeleteUser); // Baja
usuarioRouter.get('/admin/getUser/:uuid', authenticateJWT, usuarioController.adminGetUser); // Consulta individual
usuarioRouter.get('/admin/getAllUsers', authenticateJWT, usuarioController.adminGetAllUsers); // Consulta general
usuarioRouter.put('/admin/updateEtapaRegistro/:uuid', authenticateJWT, usuarioController.updateEtapaRegistro);

module.exports = usuarioRouter;
