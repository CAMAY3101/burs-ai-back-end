const express = require('express');
const modelosRouter = express.Router();
const authenticateJWT = require('../middlewares/auth.middleware');

const modelosController = require('../controllers/modelos.controller')

modelosRouter.get('/getAllValuesModels', authenticateJWT, modelosController.getAllValuesModels);

module.exports = modelosRouter;