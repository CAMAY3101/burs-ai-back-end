const { v4: uuidv4 } = require('uuid');
const {db} = require('../services/db.server');

const direccionModel = {
    createDireccion: async (id_usuario, calle, numero_exterior, numero_interior, colonia, cp, municipio, estado, tipo_vivienda) => {
        const uuid_direction = uuidv4();
        const values = [uuid_direction, id_usuario, calle, numero_exterior, numero_interior, colonia, cp, municipio, estado, tipo_vivienda];
        const query = `
            INSERT INTO direction (uuid_direction, uuid_client, calle, numero_exterior, numero_interior, colonia, cp, municipio, estado, tipo_vivienda)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING uuid_direction;
        `;
        return await db.one(query, values);
    }
};

module.exports = direccionModel;