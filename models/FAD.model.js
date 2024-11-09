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
        // Lista de columnas en el orden correcto
        const columns = ["address_line_1", "address_line_2", "address_postal_code", "back_number", "birth_date", "curp", "document_class_code", "document_class_name", "document_number", "expiration_date", "first_name", "full_name", "given_name", "issue_date", "issuing_state_code", "issuing_state_name", "middle_name", "mrz", "nationality_code", "nationality_name", "photo", "qr_barcode_center", "qr_barcode_left", "qr_barcode_right", "registration_number", "registration_year", "registration_year_and_verification_number", "sex", "signature", "surname", "verification_number", "address"];

        // Obtener valores de `data` en el mismo orden que `columns`, usando null para columnas que faltan
        const values = columns.map(column => data[column] ?? null);

        // Crear placeholders dinámicos para cada valor
        const placeholders = values.map((_, index) => `$${index + 2}`).join(', ');

        // Construir y ejecutar la consulta SQL
        const query = `
        INSERT INTO documento_identidad (id_usuario, ${columns.join(', ')})
        VALUES ($1, ${placeholders})
        RETURNING id_ocr
    `;

        return await db.one(query, [id_usuario, ...values]);
    },
    getUserInFAD: async (id_usuario) => {
        // Check in FAD if it exists id_usuario
        return await db.oneOrNone('SELECT id_usuario FROM fad WHERE id_usuario = $1', [id_usuario]);
    }, 

};

module.exports = FADModel; 