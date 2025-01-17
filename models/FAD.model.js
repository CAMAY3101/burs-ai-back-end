const { db } = require('../services/db.server')
const { v4: uuidv4 } = require('uuid');
const usuarioModel = require("./usuario.model");

const FADModel = {
    registerValidationData: async (uuid_client, data) => {
        const uuid = uuidv4()
        return await db.one('INSERT INTO fad (uuid_fad, uuid_client, key_fad, vector_fad, validationid_fad) VALUES ($1, $2, $3, $4, $5) RETURNING uuid_fad', [uuid, uuid_client, data.key, data.vector, data.validationId])
    },
    getValidationID: async (uuid_client) => {
        return await db.one('SELECT validationid_fad FROM fad WHERE uuid_client = $1', [uuid_client])
    },
    getClientInOCRInformation: async(uuid_client)=>{
        return await db.oneOrNone('SELECT uuid_client FROM ocr WHERE uuid_client = $1;',[uuid_client])
    },
    addOCRInformation: async (uuid_client, data) => {

        // console.log("ESTO LLEGA EN DATA EN ADD OCR INFORMATION: ", data);
        // Lista de columnas en el orden correcto
        const columns = ["address_line_1", "address_line_2", "address_postal_code", "back_number", "birth_date", "curp", "document_class_code", "document_class_name", "document_number", "expiration_date", "first_name", "full_name", "given_name", "issue_date", "issuing_state_code", "issuing_state_name", "middle_name", "mrz", "nationality_code", "nationality_name", "photo", "qr_barcode_center", "qr_barcode_left", "qr_barcode_right", "registration_number", "registration_year", "registration_year_and_verification_number", "sex", "signature", "surname", "verification_number", "address"];

        // Obtener valores de `data` en el mismo orden que `columns`, usando null para columnas que faltan
        const values = columns.map(column => data[column] ?? null);

        // Crear placeholders dinámicos para cada valor
        const placeholders = values.map((_, index) => `$${index + 3}`).join(', ');

        const uuid_ocr = uuidv4();
        // Construir y ejecutar la consulta SQL
        const query = `
        INSERT INTO ocr (uuid_client, uuid_ocr, ${columns.join(', ')})
        VALUES ($1, $2, ${placeholders})
        RETURNING id_ocr
    `;

        return await db.one(query, [uuid_client, uuid_ocr, ...values]);
    },
    getUserInFAD: async (uuid_client) => {
        // Check in FAD if it exists uuid_client
        return await db.oneOrNone('SELECT uuid_client FROM fad WHERE uuid_client = $1', [uuid_client]);
    },

};

module.exports = FADModel;
