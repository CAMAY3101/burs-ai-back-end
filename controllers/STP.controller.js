const rp = require('request-promise');
const stp_functions = require("../stp/stp.functions");

const Joi = require('joi');

const schema = Joi.object({
    // Campos requeridos
    claveRastreo: Joi.string().min(8).max(30).required(),
    conceptoPago: Joi.string().max(40).required(),
    cuentaOrdenante: Joi.string().max(20).required(),
    cuentaBeneficiario: Joi.string().max(20).required(),
    empresa: Joi.string().max(15).required(),
    institucionContraparte: Joi.string().max(5).required(),
    institucionOperante: Joi.string().max(5).required(),
    monto: Joi.string()
        .pattern(/^\d+(\.\d{2})$/) // Solo números con exactamente dos decimales
        .required()
        .messages({
            "string.pattern.base": "El campo 'monto' debe ser un número decimal con exactamente dos dígitos después del punto, por ejemplo: 20.00.",
        }),
    tipoPago: Joi.number().valid(1, 2, 3).required(),
    nombreBeneficiario: Joi.string().max(40).required(),
    tipoCuentaOrdenante: Joi.string().max(2).required(),
    nombreOrdenante: Joi.string().max(40).required(),
    rfcCurpOrdenante: Joi.string().max(18).required(),
    rfcCurpBeneficiario: Joi.string().max(18).required(),
    referenciaNumerica: Joi.string().max(7).required(),
    latitud: Joi.string().max(30).required(),
    longitud: Joi.string().max(30).required(),

    // Campos opcionales
    emailBeneficiario: Joi.string().email().allow(null, '').optional(),
    tipoCuentaBeneficiario: Joi.string().max(2).optional(),
    tipoCuentaBeneficiario2: Joi.string().max(2).optional(),
    nombreBeneficiario2: Joi.string().max(40).optional(),
    cuentaBeneficiario2: Joi.string().max(20).optional(),
    rfcCurpBeneficiario2: Joi.string().max(18).optional(),
    conceptoPago2: Joi.string().max(40).optional(),
    claveCatUsuario1: Joi.string().max(10).optional(),
    claveCatUsuario2: Joi.string().max(10).optional(),
    clavePago: Joi.string().max(3).optional(),
    referenciaCobranza: Joi.string().max(20).optional(),
    tipoOperacion: Joi.string().max(2).optional(),
    topologia: Joi.string().max(10).optional(),
    usuario: Joi.string().max(50).optional(),
    medioEntrega: Joi.string().max(5).optional(),
    prioridad: Joi.string().max(1).optional(),
    iva: Joi.number().precision(2).positive().optional(),
});


const STPController = {
    // register: async (req, res) => {
    //     try {
    //         // Paso 1: Obtener los datos de la solicitud
    //         const datos = await schema.validateAsync(req.body);

    //         // Paso 2: Generar la cadena original
    //         const cadenaOriginal = stp_functions.generarCadenaOriginal(datos);
    //         console.log('cadenaOriginal: ', cadenaOriginal)

    //         // Paso 3: Generar el hash SHA-256 de la cadena original
    //         // const hash = stp_functions.generarHash(cadenaOriginal);

    //         // Paso 4: Firmar el hash con la llave privada
    //         const firma = stp_functions.getSign(cadenaOriginal);

    //         // Paso 5: Realizar la petición REST a STP
    //         const respuestaSTP = await stp_functions.enviarPeticionREST(datos, firma);

    //         // Paso 6: Enviar la respuesta de STP al cliente
    //         return res.status(200).json({
    //             datos: datos,
    //             cadenaOriginal: cadenaOriginal,
    //             // hash: hash,
    //             firma: firma,
    //             respuestaSTP:respuestaSTP
    //         });

    //     } catch (error) {
    //         console.error('Error en el proceso de registro:', error);
    //         return res.status(400).json({ error: error });
    //     }
    // }

    register: async (req, res) => {
        try {
            const peticion = req.body;
            let cadenaOriginal = `||${peticion.institucionOperante}|${peticion.empresa}|||${peticion.claveRastreo}|${peticion.institucionContraparte}|${peticion.monto}|${peticion.tipoPago}|${peticion.tipoCuentaBeneficiario}||${peticion.cuentaOrdenante}||${peticion.tipoCuentaOrdenante}|${peticion.nombreBeneficiario}|${peticion.cuentaBeneficiario}|${peticion.rfcCurpBeneficiario}||||||${peticion.conceptoPago}||||||${peticion.referenciaNumerica}||||||||`;

            let firma = stp_functions.getSign( cadenaOriginal );

            peticion.firma = firma;

            rp({
                url: 'https://demo.stpmex.com:7024/speiws/rest/ordenPago/registra',
                method: 'PUT',
                json: true,
                body: peticion,
                rejectUnauthorized: false
            })
            .then((response) => {
                console.log('success', JSON.stringify(response));
                res.status(200).json({
                    cadenaOriginal,
                    response
                })
            })
            .catch((error)=>{
                console.log('error', JSON.stringify(error))
            });

        } catch (error) {
            console.error('Error en el proceso de registro:', error);
            return res.status(400).json({ error: error });
        }
    }

};



module.exports = STPController;