const direccionModel = require('../models/direccion.model');
const usuarioModel = require('../models/usuario.model');

const direccionController = {
    createDireccion: async (req, res, next) => {
        try {
            const id_usuario = req.user.uuid_user;
            const direccion = {
                calle: req.body.calle,
                numero_exterior: req.body.numero_exterior,
                numero_interior: req.body.numero_interior,
                colonia: req.body.colonia,
                cp: req.body.cp,
                municipio: req.body.municipio,
                estado: req.body.estado,
                tipo_vivienda: req.body.tipo_vivienda
            };
            
            await direccionModel.createDireccion(id_usuario, 
                direccion.calle, direccion.numero_exterior, direccion.numero_interior,
                direccion.colonia, direccion.cp, direccion.municipio, direccion.estado,
                direccion.tipo_vivienda
            );

            await usuarioModel.updateVerificacionStepStatus(id_usuario, 'verificar correo')
            res.status(200).json({ 
                status: 'success',
                message: 'Direccion creada'
            });

        } catch (error) {
            const serverError = new Error();
            serverError.statusCode = 500;
            serverError.status = 'error';
            console.log("Error en createDireccion");
            console.log(error);
            next(serverError);
        }
    }

};

module.exports = direccionController;