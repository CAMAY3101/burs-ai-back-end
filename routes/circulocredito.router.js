const express = require('express');
const circuloCreditoRouter = express.Router();
const authenticateJWT = require('../middlewares/auth.middleware');

const circuloCreditoController = require('../controllers/circulocredito.controller');

// Endpoint para obtener los datos del solicitante
circuloCreditoRouter.get('/getSolicitersData', authenticateJWT, circuloCreditoController.getSolicitersData);

// Endpoint para obtener los datos del domicilio solicitante
circuloCreditoRouter.get('/getSolicitersDataAddress', authenticateJWT, circuloCreditoController.getSolicitersDataAddress);

// Endpoint para obtener los datos y el domicilio del solicitante
circuloCreditoRouter.get('/getSolicitersDataAndAddress', authenticateJWT, circuloCreditoController.getSolicitersDataAndAddress);

// Endpoint para actualizar los datos del solicitante
circuloCreditoRouter.post('/updateSolicitersData', authenticateJWT, circuloCreditoController.updateSolicitersData);

// Endpoint para crear un nuevo término y condición
circuloCreditoRouter.post('/crear-termino', authenticateJWT, circuloCreditoController.crearTermino);

// Endpoint para obtener todos los términos y condiciones
circuloCreditoRouter.get('/terminos-condiciones', authenticateJWT, circuloCreditoController.obtenerTerminos);

// Endpoint para enviar el NIP por correo o teléfono
circuloCreditoRouter.post('/enviar-nip', authenticateJWT, circuloCreditoController.enviarNIP);

// Endpoint para verificar la aceptación de términos y condiciones
circuloCreditoRouter.post('/aceptar-terminos', authenticateJWT, circuloCreditoController.aceptarTerminos);

module.exports = circuloCreditoRouter;
