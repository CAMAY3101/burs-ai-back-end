const express = require('express');
const direccionRouter = express.Router();
const authenticateJWT = require('../middlewares/auth.middleware');

const direccionController = require('../controllers/direccion.controller');

direccionRouter.post('/createDireccion', authenticateJWT, direccionController.createDireccion);

module.exports = direccionRouter;