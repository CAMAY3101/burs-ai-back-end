const {db} = require('../services/db.server');

const direccionModel = {
    createDireccion: async (id_usuario, calle, numero_exterior, numero_interior, colonia, cp, municipio, estado, tipo_vivienda) => {
        const values = [id_usuario, calle, numero_exterior, numero_interior, colonia, cp, municipio, estado, tipo_vivienda];
        const query = `
            INSERT INTO direccion (id_usuario, calle, numero_exterior, numero_interior, colonia, cp, municipio, estado, tipo_vivienda)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id_direccion;
        `;
        return await db.one(query, values);
    }
};

module.exports = direccionModel;