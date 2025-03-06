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



// model Historial {
//     uuid_historial        String  @id @default(uuid())
//     uuid_client           String
//     salario_mensual       Float
//     ocupacion            String
//     industria            String
//     subindustria         String
//     pago_a_traves_de_banco Boolean
//     salario_familiar     Float
//     calificacion_crediticia Int
//     uso_prestamo         String
//     camponuevo           String

//     createdAt            DateTime @default(now())
//   }


// npx prisma migrate dev --name campo_nuevo_historial_table


// const { PrismaClient } = require('@prisma/client');

// const prisma = new PrismaClient();

// const historialModel = {
//     updateDataHistorial: async (uuid_client, salario_mensual, ocupacion, industria, subindustria,
//         pago_a_traves_de_banco, salario_familiar, calificacion_crediticia, uso_prestamo) => {

//         return await prisma.historial.create({
//             data: {
//                 uuid_client,
//                 salario_mensual,
//                 ocupacion,
//                 industria,
//                 subindustria,
//                 pago_a_traves_de_banco,
//                 salario_familiar,
//                 calificacion_crediticia,
//                 uso_prestamo
//             }
//         });
//     },

//     getSalarioMensual: async (id_usuario) => {
//         console.log('historial model getSalarioMensual');
//         const result = await prisma.historial.findUnique({
//             where: { uuid_client: id_usuario },
//             select: { salario_mensual: true }
//         });
//         console.log('historial model result', result);
//         return result;
//     }
// };

// module.exports = historialModel;




// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// describe('Historial Model', () => {
//   test('Debe insertar un historial y devolver un UUID', async () => {
//     const historial = await prisma.historial.create({
//       data: {
//         uuid_client: '1234-5678-9101',
//         salario_mensual: 5000,
//         ocupacion: 'Desarrollador',
//         industria: 'Tecnología',
//         subindustria: 'Software',
//         pago_a_traves_de_banco: true,
//         salario_familiar: 10000,
//         campo_nuevo: 121,
//         calificacion_crediticia: 'A',
//         uso_prestamo: 'Casa',
//       },
//     });

//     expect(historial.uuid_historial).toBeDefined();
//   });

//   test('Debe obtener el salario mensual de un usuario', async () => {
//     const historial = await prisma.historial.findFirst({
//       where: { uuid_client: '1234-5678-9101' },
//     });

//     expect(historial.salario_mensual).toBe(5000);
//   });
// });
