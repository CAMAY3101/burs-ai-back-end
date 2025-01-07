const { v4: uuidv4 } = require('uuid');
const { db } = require('../services/db.server');

const historialModel = {
    updateDataHistorial: async (uuid_client, salario_mensual, ocupacion, industria, subindustria,
        pago_a_traves_de_banco, salario_familiar, calificacion_crediticia, uso_prestamo) => {
        
        const uuid = uuidv4();

        const values = [uuid, uuid_client, salario_mensual, ocupacion, industria,
            subindustria, pago_a_traves_de_banco, salario_familiar, 
            calificacion_crediticia, uso_prestamo]
        
        const query = `
            INSERT INTO historial (uuid_historial, uuid_client, salario_mensual, ocupacion, industria, subindustria, pago_a_traves_de_banco, salario_familiar, calificacion_crediticia, uso_prestamo)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING uuid_historial;
        `;
        return await db.one(query, values);
    },
    getSalarioMensual: async (id_usuario) => {
        console.log('historial model getSalarioMensual');
        const result = await db.one('SELECT salario_mensual FROM historial WHERE id_usuario = $1', [id_usuario]);
        console.log('historial model result', result);
        return result
    }
};

module.exports = historialModel;