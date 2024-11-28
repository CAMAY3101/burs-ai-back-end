const axios = require('axios');
const crypto = require('crypto');
const fs = require('fs');

const STPController = {
    register: async (req, res) => {
        try {
            // Paso 1: Obtener los datos de la solicitud
            const datos = req.body;  // Supone que los datos se envían en el cuerpo de la petición (req.body)

            // Paso 2: Generar la cadena original
            const cadenaOriginal = generarCadenaOriginal(datos);

            // Paso 3: Generar el hash SHA-256 de la cadena original
            const hash = generarHash(cadenaOriginal);

            // Paso 4: Firmar el hash con la llave privada
            const firma = firmarHash(hash);

            // Paso 5: Realizar la petición REST a STP
            const respuestaSTP = await enviarPeticionREST(datos, firma);

            // Paso 6: Enviar la respuesta de STP al cliente
            return res.status(200).json(respuestaSTP);

        } catch (error) {
            // Manejar errores y devolver un error 500
            console.error('Error en el proceso de registro:', error);
            return res.status(500).json({ error: 'Hubo un error al registrar la orden.' });
        }
    }
};

// Función para generar la cadena original
function generarCadenaOriginal(datos) {
    const { institucionContraparte, empresa, fechaOperacion, folioOrigen, claveRastreo, 
            institucionOperante, monto, tipoPago, tipoCuentaOrdenante, nombreOrdenante, 
            cuentaOrdenante, rfcCurpOrdenante, tipoCuentaBeneficiario, nombreBeneficiario, 
            cuentaBeneficiario, rfcCurpBeneficiario, emailBeneficiario, tipoCuentaBeneficiario2, 
            nombreBeneficiario2, cuentaBeneficiario2, rfcCurpBeneficiario2, conceptoPago, 
            conceptoPago2, claveCatUsuario1, claveCatUsuario2, clavePago, referenciaCobranza, 
            referenciaNumerica, tipoOperacion, topologia, usuario, medioEntrega, prioridad, iva } = datos;

    return `||${institucionContraparte}|${empresa}|${fechaOperacion}|${folioOrigen}|${claveRastreo}|${institucionOperante}|${monto}|${tipoPago}|${tipoCuentaOrdenante}|${nombreOrdenante}|${cuentaOrdenante}|${rfcCurpOrdenante}|${tipoCuentaBeneficiario}|${nombreBeneficiario}|${cuentaBeneficiario}|${rfcCurpBeneficiario}|${emailBeneficiario}|${tipoCuentaBeneficiario2}|${nombreBeneficiario2}|${cuentaBeneficiario2}|${rfcCurpBeneficiario2}|${conceptoPago}|${conceptoPago2}|${claveCatUsuario1}|${claveCatUsuario2}|${clavePago}|${referenciaCobranza}|${referenciaNumerica}|${tipoOperacion}|${topologia}|${usuario}|${medioEntrega}|${prioridad}|${iva}||`;
}

// Función para generar el hash SHA-256 de la cadena original
function generarHash(cadenaOriginal) {
    return crypto.createHash('sha256').update(cadenaOriginal, 'utf8').digest();
}

// Función para firmar el hash con la llave privada RSA
function firmarHash(hash) {
    const privateKey = fs.readFileSync('../stp/llavePrivadaPruebas.pem', 'utf8'); // Cambia la ruta de tu archivo de llave privada
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(hash);
    sign.end();
    return sign.sign(privateKey, 'base64');
}

// Función para enviar la petición REST a STP
async function enviarPeticionREST(datos, firma) {
    const url = 'https://demo.stpmex.com:7024/speiws/rest/ordenPago/registra';
    const headers = {
        'Content-Type': 'application/json',
        'Encoding': 'UTF-8',
    };

    const cuerpoPeticion = {
        registraOrden: {
            ordenPago: {
                claveRastreo: datos.claveRastreo,
                conceptoPago: datos.conceptoPago,
                cuentaBeneficiario: datos.cuentaBeneficiario,
                cuentaOrdenante: datos.cuentaOrdenante,
                empresa: datos.empresa,
                fechaOperacion: datos.fechaOperacion,
                firma: firma,
                institucionContraparte: datos.institucionContraparte,
                institucionOperante: datos.institucionOperante,
                monto: datos.monto,
                tipoPago: datos.tipoPago,
                tipoCuentaOrdenante: datos.tipoCuentaOrdenante,
                nombreOrdenante: datos.nombreOrdenante,
                rfcCurpOrdenante: datos.rfcCurpOrdenante,
                nombreBeneficiario: datos.nombreBeneficiario,
                cuentaBeneficiario: datos.cuentaBeneficiario,
                rfcCurpBeneficiario: datos.rfcCurpBeneficiario,
                referenciaNumerica: datos.referenciaNumerica,
                longitud: datos.longitud,
                latitud: datos.latitud
            }
        }
    };

    try {
        const response = await axios.post(url, cuerpoPeticion, { headers });
        return response.data; // Retorna la respuesta de STP
    } catch (error) {
        console.error('Error en la petición a STP:', error);
        throw new Error('Error en la petición a STP');
    }
}

module.exports = STPController;
