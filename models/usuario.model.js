const { db } = require('../services/db.server');
const { comparePassword } = require('../services/auth.service')
const { v4: uuidv4 } = require('uuid');

const usuarioModel = {
    getclient: async () => {
        const result = await db.many('SELECT * FROM client');
        return result;
    },
    login: async (correo) => {
        return await db.oneOrNone('SELECT * FROM client WHERE correo = $1', [correo]);
    },
    createUser: async (uuid, correo, password, step, fecha_nacimiento = '') => {
    const fecha = fecha_nacimiento === "" ? null : fecha_nacimiento;
        return await db.one('INSERT INTO client (uuid_client, correo, contrasena, nombre, apellidos, telefono, etapa_registro, fecha_nacimiento, curp, op_telefono ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING uuid_client', [uuid, correo, password, '', '', '', step, fecha, '' , '']);
    },
    updateVerification: async (uuid_client, termsAccepted) => {
        const uuidVerification = uuidv4();
        return await db.none(
          'INSERT INTO verification (uuid_verification, uuid_client, verificacion_tyc) VALUES($1, $2, $3)',
          [uuidVerification, uuid_client, termsAccepted]
        );
      },
      
    updateDataUser: async (uuid_client, nombre, apellidos, telefono, step, fecha_nacimiento, curp, op_telefono) => {
        return await db.none(`UPDATE client SET nombre = $2, apellidos = $3, telefono = $4, etapa_registro = $5, fecha_nacimiento = $6, curp = $7, op_telefono = $8 WHERE uuid_client = $1`, [uuid_client, nombre, apellidos, telefono, step, fecha_nacimiento, curp, op_telefono]);
    },
      
    getEmailUser: async (uuid_client) => {
        return await db.one('SELECT correo FROM client WHERE uuid_client = $1', [uuid_client]);
    },
    getPhoneUser: async (uuid_client) => {
        return await db.one('SELECT telefono FROM client WHERE uuid_client = $1', [uuid_client]);
    },
    updateVerificacionStepStatus: async (uuid_client, step) => {
        return await db.none('UPDATE client SET etapa_registro = $1 WHERE uuid_client = $2', [step, uuid_client]);
    },
    getVerificacionStepStatus: async (uuid_client) => {
        return await db.one('SELECT etapa_registro FROM client WHERE uuid_client = $1', [uuid_client]);
    },
    getPersonalDataUser: async (uuid_client) => {
        return await db.one('SELECT nombre, apellidos, correo, telefono FROM client WHERE uuid_client = $1', [uuid_client]);
    }, 
};

module.exports = usuarioModel;