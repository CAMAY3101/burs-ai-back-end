const { db } = require('../services/db.server');

const historialModel = {
    updateDataHistorial: async (id_usuario, salario_mensual, ocupacion, industria, subindustria,
        pago_a_traves_de_banco, salario_familiar, calificacion_crediticia, uso_prestamo) => {

        const values = [id_usuario, salario_mensual, ocupacion, industria,
            subindustria, pago_a_traves_de_banco,salario_familiar, 
            calificacion_crediticia, uso_prestamo]
        
        const query = `
            INSERT INTO historial (id_usuario, salario_mensual, ocupacion, industria, subindustria, pago_a_traves_de_banco, salario_familiar, calificacion_crediticia, uso_prestamo)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id_historial;
        `;
        return await db.one(query, values);
    }
};

module.exports = historialModel;