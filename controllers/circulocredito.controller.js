const qs = require("qs");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");

const { db } = require("../services/db.server");
const { hashPassword, comparePassword } = require("../services/auth.service");
const twilioService = require("../services/twilio.service");

dotenv.config();

const circuloCreditoModel = require("../models/circulocredito.model");

const circuloCreditoController = {
  async getSolicitersData(req, res, next) {
    try {
      const userId = req.user.uuid_user;
      const result = await circuloCreditoModel.getSolicitersData(userId);

      if (!result) {
        const error = new Error("No se encontraron datos del solicitante");
        error.statusCode = 404;
        error.status = "error en datos";
        return next(error);
      }

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      const serverError = new Error();
      serverError.statusCode = 500;
      serverError.status = "error";
      serverError.message = error;
      next(serverError);
    }
  },

  async getSolicitersDataAddress(req, res, next) {
    try {
      const userId = req.user.uuid_user;
      const result = await circuloCreditoModel.getSolicitersDataAddress(userId);

      if (!result) {
        const error = new Error("No se encontraron datos del solicitante");
        error.statusCode = 404;
        error.status = "error en datos";
        return next(error);
      }

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      const serverError = new Error();
      serverError.statusCode = 500;
      serverError.status = "error";
      serverError.message = error;
      next(serverError);
    }
  },

  async getSolicitersDataAndAddress(req, res, next) {
    try {
      const userId = req.user.uuid_user;
      const result = await circuloCreditoModel.getSolicitersDataAndAddress(userId);

      if (!result) {
        const error = new Error("No se encontraron datos del solicitante");
        error.statusCode = 404;
        error.status = "error en datos";
        return next(error);
      }

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      const serverError = new Error();
      serverError.statusCode = 500;
      serverError.status = "error";
      serverError.message = error;
      next(serverError);
    }
  },

  async updateSolicitersData(req, res, next) {
    try {
      const userId = req.user.uuid_user;
      const {
        nombres,
        apellidos,
        domicilio,
        curp,
        rfc,
        fechaNacimiento,
        telefono,
        email,
      } = req.body;

      if (!nombres || !apellidos || !telefono || !email) {
        const error = new Error("Faltan datos obligatorios");
        error.statusCode = 400;
        error.status = "error en datos";
        return next(error);
      }

      const result = await circuloCreditoModel.updateSolicitersData(
        userId,
        nombres,
        apellidos,
        domicilio,
        curp,
        rfc,
        fechaNacimiento,
        telefono,
        email
      );

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      const serverError = new Error();
      serverError.statusCode = 500;
      serverError.status = "error";
      serverError.message = error;
      next(serverError);
    }
  },

  async crearTermino(req, res, next) {
    try {
      const { titulo, contenido } = req.body;

      if (!titulo || !contenido) {
        const error = new Error("Faltan datos obligatorios");
        error.statusCode = 400;
        error.status = "error en datos";
        return next(error);
      }

      const uuid = uuidv4();

      const result = await circuloCreditoModel.crearTermino(
        uuid,
        titulo,
        contenido
      );

      res.status(201).json({
        status: "success",
        data: result,
        message: "Terminos y condiciones creados",
      });
    } catch (error) {
      const serverError = new Error();
      serverError.statusCode = 500;
      serverError.status = "error";
      serverError.message = error;
      next(serverError);
    }
  },

  async obtenerTerminos(req, res, next) {
    try {
      const result = await circuloCreditoModel.obtenerTerminos();

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      const serverError = new Error();
      serverError.statusCode = 500;
      serverError.status = "error";
      serverError.message = error;
      next(serverError);
    }
  },

  async enviarNIP(req, res, next) {
    try {
      const { email, telefono } = req.body;

      const nip = Math.floor(1000 + Math.random() * 9000);

      if (email) {
        await nodemailer.sendMail({
          to: email,
          subject: "Tu NIP de verificación",
          text: `Tu NIP es: ${nip}`,
        });
      } else if (telefono) {
        await twilioService.sendSMS(telefono, `Tu NIP es: ${nip}`);
      } else {
        const error = new Error("Debes proporcionar un correo o teléfono");
        error.statusCode = 400;
        error.status = "error en datos";
        return next(error);
      }

      res.status(200).json({
        status: "success",
        message: "NIP enviado correctamente",
      });
    } catch (error) {
      const serverError = new Error();
      serverError.statusCode = 500;
      serverError.status = "error";
      serverError.message = error;
      next(serverError);
    }
  },

  async aceptarTerminos(req, res, next) {
    try {
      const userId = req.user.uuid_user;
      const { terminosAceptados } = req.body;

      if (!terminosAceptados) {
        const error = new Error("Debes aceptar los términos y condiciones");
        error.statusCode = 400;
        error.status = "error en datos";
        return next(error);
      }

      const result = await circuloCreditoModel.aceptarTerminos(
        userId,
        terminosAceptados
      );

      res.status(200).json({
        status: "success",
        data: result,
        message: "Los terminos fueron aceptados con exito.",
      });
    } catch (error) {
      const serverError = new Error();
      serverError.statusCode = 500;
      serverError.status = "error";
      serverError.message = error;
      next(serverError);
    }
  },
};

module.exports = circuloCreditoController;
