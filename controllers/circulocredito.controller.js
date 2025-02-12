const qs = require("qs");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");
const { db } = require("../services/db.server");
const { hashPassword, comparePassword } = require("../services/auth.service");
const twilioService = require("../services/twilio.service");

dotenv.config();

const usuarioModel = require("../models/usuario.model");
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
      const result = await circuloCreditoModel.getSolicitersDataAndAddress(
        userId
      );

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

  async updateSolicitersDataAndAddress(req, res, next) {
    try {
      const userId = req.user.uuid_user;
      const {
        nombre,
        apellidos,
        correo,
        telefono,
        edad,
        calle,
        numero_exterior,
        numero_interior,
        colonia,
        cp,
        municipio,
        estado,
        tipo_vivienda,
      } = req.body;

      const result = await circuloCreditoModel.updateSolicitersDataAndAddress(
        userId,
        nombre,
        apellidos,
        correo,
        telefono,
        edad,
        calle,
        numero_exterior,
        numero_interior,
        colonia,
        cp,
        municipio,
        estado,
        tipo_vivienda
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

      console.log("ESTAMOS EN ENVIAR NIP: ", { email, nip });

      if (email) {
        try {
          const userId = req.user.uuid_user;

          const emailModel = await usuarioModel.getEmailUser(userId);
          await twilioService.sendOTP_Email(emailModel.correo);

          res.status(200).json({
            status: "success",
            message: "Código de verificación enviado con éxito",
          });
        } catch (error) {
          const errorSendEmail = new Error();
          errorSendEmail.statusCode = 500;
          errorSendEmail.status = "error en el envío de NIP por correo";
          console.log(error);
          next(errorSendEmail);
        }
      } else if (telefono) {
        try {
          const userId = req.user.uuid_user;

          const phoneModel = await usuarioModel.getPhoneUser(userId);
          await twilioService.sendOTP_PhoneNumber(phoneModel.telefono);

          res.status(200).json({
            status: "success",
            message: "Código de verificación enviado con éxito",
          });
        } catch (error) {
          const errorSendPhone = new Error();
          errorSendPhone.statusCode = 500;
          errorSendPhone.status = "error en el envío de NIP por teléfono";
          next(errorSendPhone);
        }
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
      console.log(error);
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
