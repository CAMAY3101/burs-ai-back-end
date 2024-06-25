const express = require('express');
const historialRouter = express.Router();
const authenticateJWT = require('../middlewares/auth.middleware');

const historialController = require('../controllers/historial.controller');

historialRouter.post('/updateDataHistorial', authenticateJWT, historialController.updateDataHistorial);

module.exports = historialRouter;