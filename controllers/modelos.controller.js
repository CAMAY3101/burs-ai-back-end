const historialModelo = require('../models/historial.model');
const CalculosModelos = require('../evaluations/modelos')

const modelosController = {
    getAllValuesModels: async (req, res, next) => {
        try{
            const id_usuario = req.user.id_usuario;
            const parameters = {
                egresos: req.body.egresos,
            };
            const valores_fijos = {
                plazoMaxDias: 99, 
                tazaInteres: 0.0124,
            }
            const ingresos = historialModelo.getIngresos(id_usuario);

            const CapacidadPagoDiario = CalculosModelos.CapacidadDePagoDiario(ingresos, egresos, valores_fijos.plazoMaxDias);


        } catch {

        }
    }
};

module.exports = modelosController;