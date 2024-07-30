const historialModel = require('../models/historial.model');
const CalculosModelos = require('../evaluations/modelos')

const modelosController = {
    getAllValuesModels: async (req, res, next) => {
        try{
            const id_usuario = req.user.id_usuario;
            const parameters = {
                egresos: req.body.egresos,
                montoSolicitado: req.body.montoSolicitado,
            };
            const valores_fijos = {
                plazoMaxDias: 99, 
                tazaInteres: 0.0124,
            }
            console.log('getAllValuesModels');
            console.log('id_usuario', id_usuario);
            console.log('parameters', parameters);

            const ingresosD = await historialModel.getSalarioMensual(id_usuario);
            const ingresos = ingresosD.salario_mensual;
            console.log('ingresos controller', ingresosD);

            const CapacidadPagoDiario = CalculosModelos.CapacidadDePagoDiario(ingresos, parameters.egresos, valores_fijos.plazoMaxDias);
            const CapacidadDeDiasDeCredito = CalculosModelos.CalculoDeDiasDeCredito(CapacidadPagoDiario);
            const ParametroDiasDePago = CalculosModelos.ParametroDiasDePago(CapacidadPagoDiario, parameters.montoSolicitado);
            console.log('ParametroDiasDePago', ParametroDiasDePago);

            res.status(200).json({
                status: 'success',
                CapacidadPagoDiario: CapacidadPagoDiario,
                CapacidadDeDiasDeCredito: CapacidadDeDiasDeCredito,
                ParametroDiasDePago: ParametroDiasDePago,

            });

        } catch {
            const errorGetAllValuesModels = new Error();
            errorGetAllValuesModels.statusCode = 500;
            errorGetAllValuesModels.status = 'error';
            next(errorGetAllValuesModels);
        }
    }
};

module.exports = modelosController;