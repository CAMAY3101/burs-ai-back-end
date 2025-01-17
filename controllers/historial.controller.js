const historialModel = require('../models/historial.model')
const usuarioModel = require('../models/usuario.model')

const historialController = {
    updateDataHistorial: async (req, res, next) => {
        try {
            const id_usuario = req.user.uuid_user;
            const historial = {
                salario_mensual: req.body.salario_mensual,
                ocupacion: req.body.ocupacion,
                industria: req.body.industria,
                subindustria: req.body.subindustria,
                pago_a_traves_de_banco: req.body.pago_a_traves_de_banco,
                salario_familiar: req.body.salario_familiar,
                calificacion_crediticia: req.body.calificacion_crediticia,
                uso_prestamo: req.body.uso_prestamo
            };
            
            await historialModel.updateDataHistorial(id_usuario, 
                historial.salario_mensual, historial.ocupacion, historial.industria,
                historial.subindustria, historial.pago_a_traves_de_banco,
                historial.salario_familiar, historial.calificacion_crediticia, historial.uso_prestamo
            );
            await usuarioModel.updateVerificacionStepStatus(id_usuario, 'ingresar domicilio')
            res.status(200).json({ 
                status: 'success',
                message: 'Historial actualizado',
            });
        } catch (error) {
            console.log(error)
            const serverError = new Error();
            serverError.statusCode = 500;
            serverError.status = 'error';
            next(serverError);
        }
    }
};

module.exports = historialController;