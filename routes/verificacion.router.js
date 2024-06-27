const express = require('express');
const verificacionRouter = express.Router();
const authenticateJWT = require('../middlewares/auth.middleware');

const verificacionController = require('../controllers/verificacion.controller')

verificacionRouter.post('/sendOTPCodeEmail', authenticateJWT, verificacionController.sendOTPCodeEmail);
verificacionRouter.post('/sendOTPCodePhoneNumber', authenticateJWT, verificacionController.sendOTPCodePhoneNumber);
verificacionRouter.post('/resendOTPCodeEmail', authenticateJWT, verificacionController.resendOTPCodeEmail);
verificacionRouter.post('/resendOTPCodePhoneNumber', authenticateJWT, verificacionController.resendOTPCodePhoneNumber);
verificacionRouter.post('/verifyEmail', authenticateJWT, verificacionController.verifyEmail);
verificacionRouter.post('/verifyPhoneNumber', authenticateJWT, verificacionController.verifyPhoneNumber); 

module.exports = verificacionRouter;