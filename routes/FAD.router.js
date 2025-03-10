const express = require('express');
const FADRouter = express.Router();
const FADController = require('../controllers/FAD.controller')
const decodeFADToken = require('../middlewares/decodeFAD.middleware');

FADRouter.post('/generateToken', FADController.generateToken);
FADRouter.post('/createValidation', decodeFADToken, FADController.createValidation);
FADRouter.get('/getValidationStep', decodeFADToken, FADController.getValidationStep);
FADRouter.get('/getValidationData', decodeFADToken, FADController.getValidationData);
FADRouter.get('/getUserInFAD', FADController.getUserInFAD);
FADRouter.post('/sendFiles', decodeFADToken, FADController.sendFiles);

module.exports = FADRouter; 