const express = require('express');
const verificacionRouter = express.Router();
const authenticateJWT = require('../middlewares/auth.middleware');

const verificacionController = require('../controllers/verificacion.controller')