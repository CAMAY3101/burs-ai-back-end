const { db } = require("../services/db.server");
const { comparePassword } = require("../services/auth.service");

const circuloCreditoModel = {
  getSolicitersData: async (uuid_user) => {
    return await db.oneOrNone(
      "SELECT nombre, apellidos, correo, telefono FROM client WHERE uuid_client = $1",
      [uuid_user]
    );
  },

  getSolicitersDataAddress: async (uuid_user) => {
    return await db.oneOrNone(
      "SELECT calle, numero_exterior, numero_interior, colonia, cp, municipio, estado, tipo_vivienda FROM direction WHERE uuid_client = $1",
      [uuid_user]
    );
  },

  updateSolicitersData: async (
    uuid_user,
    nombres,
    apellidos,
    domicilio,
    curp,
    rfc,
    fechaNacimiento,
    telefono,
    email
  ) => {
    return await db.one(
      `UPDATE client
             SET nombre = $2, apellidos = $3, telefono = $4, correo = $5
             WHERE uuid_client = $1
             RETURNING *`,
      [uuid_user, nombres, apellidos, telefono, email]
    );
  },

  crearTermino: async (uuid, titulo, contenido) => {
    return await db.one(
      `INSERT INTO terminos_condiciones (uuid, titulo, contenido)
             VALUES ($1, $2, $3)
             RETURNING *`,
      [uuid, titulo, contenido]
    );
  },

  obtenerTerminos: async () => {
    return await db.many(
      "SELECT id, uuid, titulo, contenido FROM terminos_condiciones"
    );
  },

  aceptarTerminos: async (uuid_user, terminosAceptados) => {
    return await db.one(
      `UPDATE client
             SET terminos_aceptados = $2
             WHERE uuid_client = $1
             RETURNING *`,
      [uuid_user, terminosAceptados]
    );
  },
};

module.exports = circuloCreditoModel;
