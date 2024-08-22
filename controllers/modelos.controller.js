const historialModel = require('../models/historial.model');
const CalculosModelos = require('../evaluations/modelos')

const modelosController = {
    getAllValuesModels: async (req, res, next) => {
        try{
            const id_usuario = req.user.id_usuario;
            const parameters = {
                expenses: req.query.expenses, // Para GET
                monto_solicitado: req.query.monto_solicitado,
            };
            console.log('body:', req.body);
            const valores_fijos = {
                plazoMaxDias: 99, 
                tazaInteres: 0.0124,
            }

            const ingresosD = await historialModel.getSalarioMensual(id_usuario);
            const ingresos = ingresosD.salario_mensual;

            const CapacidadPagoDiario = CalculosModelos.CapacidadDePagoDiario(ingresos, parameters.expenses, valores_fijos.plazoMaxDias);
            const CapacidadDeDiasDeCredito = CalculosModelos.CalculoDeDiasDeCredito(CapacidadPagoDiario.CapacidadDePagoDiario);
            const ParametroDiasDePago = CalculosModelos.ParametroDiasDePago(CapacidadPagoDiario, parameters.monto_solicitado);
            const calculoCapacidadPago = CalculosModelos.calcularPuntuacionCapacidadPago(ingresos, parameters.expenses);
            

            res.status(200).json({
                status: 'success',
                results: {
                    ingresos: ingresos,
                    plazoMaxDias: valores_fijos.plazoMaxDias,
                    tazaInteres: valores_fijos.tazaInteres,
                    CapacidadPagoDiario: CapacidadPagoDiario,
                    CapacidadDeDiasDeCredito: CapacidadDeDiasDeCredito,
                    ParametroDiasDePago: ParametroDiasDePago,
                    calculoCapacidadPago: calculoCapacidadPago
                }
            });

        } catch(error) {
            console.log('Error en modelosController.getAllValuesModels:', error);
            const errorGetAllValuesModels = new Error();
            errorGetAllValuesModels.statusCode = 500;
            errorGetAllValuesModels.status = 'error';
            next(errorGetAllValuesModels);
        }
    }
};

module.exports = modelosController;