const { db } = require('../services/db.server')
const usuarioModel = require("./usuario.model");

const FADModel = {
    registerValidationData: async (id_usuario, data) => {
        return await db.one('INSERT INTO fad (id_usuario, key_fad, vector_fad, validationid_fad) VALUES ($1, $2, $3, $4) RETURNING id_fad', [id_usuario, data.key, data.vector, data.validationId])
    },
    getValidationID: async (id_usuario) => {
        return await db.one('SELECT validationid_fad FROM fad WHERE id_usuario = $1', [id_usuario])
    },
    addOCRInformation: async (id_usuario, data) => {
        // Extraer las columnas y valores de data para el SQL
        const columns = Object.keys(data).join(', ');
        const values = Object.values(data);

        const placeholders = values.map((_, index) => `$${index + 2}`).join(', ');

        // Construir la consulta SQL
        const query = `
            INSERT INTO documento_identidad (id_usuario, ${columns})
            VALUES ($1, ${placeholders})
            RETURNING id_ocr
        `;

        return await db.one(query, [id_usuario, ...values]);
    },

};

module.exports = FADModel; 