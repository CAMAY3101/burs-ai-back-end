const axios = require('axios');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path')

const stp_functions = {
    generarCadenaOriginal: (datos) => {
        const campos = [
            datos.institucionContraparte,
            datos.empresa,
            datos.fechaOperacion,
            datos.folioOrigen,
            datos.claveRastreo,
            datos.institucionOperante,
            datos.monto,
            datos.tipoPago,
            datos.tipoCuentaOrdenante,
            datos.nombreOrdenante,
            datos.cuentaOrdenante,
            datos.rfcCurpOrdenante,
            datos.tipoCuentaBeneficiario,
            datos.nombreBeneficiario,
            datos.cuentaBeneficiario,
            datos.rfcCurpBeneficiario,
            datos.emailBeneficiario,
            datos.tipoCuentaBeneficiario2,
            datos.nombreBeneficiario2,
            datos.cuentaBeneficiario2,
            datos.rfcCurpBeneficiario2,
            datos.conceptoPago,
            datos.conceptoPago2,
            datos.claveCatUsuario1,
            datos.claveCatUsuario2,
            datos.clavePago,
            datos.referenciaCobranza,
            datos.referenciaNumerica,
            datos.tipoOperacion,
            datos.topologia,
            datos.usuario,
            datos.medioEntrega,
            datos.prioridad,
            datos.iva,
        ].map((campo) => (campo ? campo.toString().trim() : ''));
    
        return `||${campos.join('|')}||`;
    },
    generarHash: (cadenaOriginal) => {
        return crypto.createHash('sha256').update(cadenaOriginal, 'utf8').digest();
    },
    firmarHash: (hash) => {
        try {
            const keyPath = path.resolve(__dirname, '../keyFiles/llavePrivada.pem');
            const privateKey = fs.readFileSync(keyPath, 'utf8');
            const sign = crypto.createSign('RSA-SHA256');
            sign.update(hash);
            sign.end();
            return sign.sign(privateKey, 'base64');
        } catch(error) {
            console.error('Error al leer la llave privada:', error);
            throw new Error('No se pudo encontrar o leer el archivo de la llave privada');
        }
    },
    getSign:function(string){
        const sign = crypto.createSign('RSA-SHA256');
        sign.update(string);
        sign.end();
        const keyPath = path.resolve(__dirname, '../keyFiles/llavePrivada.pem');
        console.log('keyPath: ', keyPath)
        const key = fs.readFileSync(keyPath);
        console.log('key: ', key)
        const signature_b64 = sign.sign({ key, passphrase: "12345678" }, "base64");
        return signature_b64;
    },
    enviarPeticionREST: async (datos, firma) => {
        const url = 'https://demo.stpmex.com:7024/speiws/rest/ordenPago/registra';
        const headers = {
            'Content-Type': 'application/json',
            'Encoding': 'UTF-8',
        };
    
        const cuerpoPeticion = {
            claveRastreo: datos.claveRastreo,
            conceptoPago: datos.conceptoPago,
            cuentaBeneficiario: datos.cuentaBeneficiario,
            cuentaOrdenante: datos.cuentaOrdenante,
            empresa: datos.empresa,
            firma: firma,
            institucionContraparte: datos.institucionContraparte,
            institucionOperante: datos.institucionOperante,
            monto: datos.monto,
            tipoPago: datos.tipoPago,
            nombreBeneficiario: datos.nombreBeneficiario,
            tipoCuentaOrdenante: datos.tipoCuentaOrdenante,
            nombreOrdenante: datos.nombreOrdenante,
            rfcCurpOrdenante: datos.rfcCurpOrdenante,
            cuentaBeneficiario: datos.cuentaBeneficiario,
            rfcCurpBeneficiario: datos.rfcCurpBeneficiario,
            referenciaNumerica: datos.referenciaNumerica,
            longitud: datos.longitud,
            latitud: datos.latitud
        };
    
        try {
            const response = await axios.put(url, cuerpoPeticion, { headers });
            return {
                stp: response.data,
                peticion: cuerpoPeticion
            }
        } catch (error) {
            console.error('Error en la petición a STP:', error);
            throw new Error('Error en la petición a STP');
        }
    }

}

module.exports = stp_functions;