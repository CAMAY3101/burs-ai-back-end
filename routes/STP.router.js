const express = require('express');
const STPRouter = express.Router();
const STPController = require('../controllers/STP.controller')

STPRouter.post('/register', STPController.register);

module.exports = STPRouter;