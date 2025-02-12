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

  getSolicitersDataAndAddress: async (uuid_user) => {
    return await db.oneOrNone(
      `SELECT
        c.nombre, c.apellidos, c.edad, c.telefono, c.correo,
        d.calle, d.numero_exterior, d.numero_interior,
        d.colonia, d.cp, d.municipio, d.estado, d.tipo_vivienda
      FROM client c
      INNER JOIN direction d
      ON c.uuid_client = d.uuid_client
      WHERE c.uuid_client = $1`,
      [uuid_user]
    );
  },

  updateSolicitersDataAndAddress: async (
    uuid_user,
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
  ) => {
    return await db.one(
      `WITH updated_client AS (
        UPDATE client
        SET
          nombre = $2,
          apellidos = $3,
          correo = $4,
          telefono = $5,
          edad = $6
        WHERE
          uuid_client = $1
        RETURNING *
      ),
      updated_direction AS (
        UPDATE direction
        SET
          calle = $7,
          numero_exterior = $8,
          numero_interior = $9,
          colonia = $10,
          cp = $11,
          municipio = $12,
          estado = $13,
          tipo_vivienda = $14
        WHERE
          uuid_client = $1
        RETURNING *
      )
      SELECT
        c.*,
        d.*
      FROM
        updated_client c
      JOIN
        updated_direction d ON c.uuid_client = d.uuid_client;`,
      [
        uuid_user,
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
      ]
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
