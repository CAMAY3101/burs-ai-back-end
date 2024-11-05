const axios = require('axios');
const qs = require('qs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config()
const formatFAD = require('../services/format_fad');
const userModel = require('../models/usuario.model');
const verificacionModel = require('../models/verificacion.model');
const fadModel = require('../models/FAD.model');
const usuarioModel = require('../models/usuario.model')

const FADController = {
    generateToken: async (req, res) => {
        try {

            // Define los parámetros que se enviarán en el body
            const params = qs.stringify({
                grant_type: 'password',
                username: process.env.FAD_EMAIL,
                password: process.env.FAD_PASSWORD_ENCRYPT
            });

            const headers = {
                'Authorization': 'Basic Wm1Ga0xXTXlZeTF3YjNKMFlXdz06TWpoa04yUTNNbUppWVRWbVpHTTBObVl4Wmpka1lXSmpZbVEyTmpBMVpEVXpaVFZoT1dNMVpHVTROakF4TldVeE9EWmtaV0ZpTnpNd1lUUm1ZelV5WWc9PQ==',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cache-Control': 'no-cache'
            }

            // Realiza la petición al endpoint de token
            const response = await axios.post(
                'https://uat.firmaautografa.com/authorization-server/oauth/token ',
                params,
                {headers}
            );

            const access_token = jwt.sign({ accessToken: response.data.access_token }, process.env.JWT_SECRET_FAD, {
                expiresIn: "1d"
            });

            res.cookie('access_token', access_token, {
                httpOnly: true,
                secure: false, // Solo en producción
                sameSite: 'None',
                maxAge: 24 * 60 * 60 * 1000, // Duración de 1 día
            });

            // Devuelve el token obtenido como respuesta
            res.status(200).json(response.data);

        } catch (error) {
            res.status(500).json({ error: 'Error al obtener el token' });
            console.log(error)
        }
    },
    createValidation: async (req, res) => {
        try {
            const accessToken = req.fad.accessToken;
            const personalData = await userModel.getPersonalDataUser(req.user.id_usuario);
            const full_name = personalData.nombre + ' ' + personalData.apellidos;

            const authorizationHeader = `Bearer ${accessToken}`

            const headers = {
                'Authorization': authorizationHeader,
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            };

            // Define el body de la solicitud
            const validationBody = {
                processName: "Validation Test",
                client: {
                    name: full_name ,
                    mail: personalData.correo,
                    phone: personalData.telefono
                },
                steps: {
                    captureId: {
                        order: 1, show: true,
                        features: { provider: 2 }
                    },
                    "formValidationId": {
                        "order": 2,
                        "show": true,
                        "input": {
                            "forms": [
                                {
                                    "classification": {
                                        "countryCode": "MEX",
                                        "cardType": 1,
                                        "cardTypeDescription": "Passport"
                                    },
                                    "fields": [
                                        {
                                            "id": "name",
                                            "inputType": "text",
                                            "label": "Nombre(s)",
                                            "replaceValue": true,
                                            "value": "Full Name",
                                            "placeholder": "Ingrese su nombre completo",
                                            "required": true
                                        },
                                        {
                                            "id": "curp",
                                            "inputType": "text",
                                            "label": "CURP",
                                            "replaceValue": true,
                                            "value": "Personal Number",
                                            "placeholder": "Ingrese su CURP",
                                            "required": true
                                        },
                                        {
                                            "id": "passportNumber",
                                            "inputType": "text",
                                            "label": "No. Pasaporte",
                                            "replaceValue": true,
                                            "value": "Document Number",
                                            "placeholder": "Ingresa tu número de pasaporte",
                                            "required": true
                                        }
                                    ]
                                },
                                {
                                    "classification": {
                                        "countryCode": "MEX",
                                        "cardType": 14,
                                        "cardTypeDescription": "Voter identification"
                                    },
                                    "fields": [
                                        {
                                            "id": "name",
                                            "inputType": "text",
                                            "label": "Nombre(s)",
                                            "replaceValue": true,
                                            "value": "Full Name",
                                            "placeholder": "Ingrese su nombre completo",
                                            "required": true
                                        },
                                        {
                                            "id": "curp",
                                            "inputType": "text",
                                            "label": "CURP",
                                            "replaceValue": true,
                                            "value": "CURP",
                                            "placeholder": "Ingrese su CURP",
                                            "required": true
                                        },
                                        {
                                            "id": "cic",
                                            "inputType": "text",
                                            "label": "CIC",
                                            "replaceValue": true,
                                            "value": "Document Number",
                                            "placeholder": "Ingrese su CIC",
                                            "required": true
                                        }
                                    ]
                                },
                                {
                                    "default": true,
                                    "fields": [
                                        {
                                            "id": "name",
                                            "inputType": "text",
                                            "label": "Nombre(s)",
                                            "placeholder": "Ingrese su nombre completo",
                                            "required": true
                                        }
                                    ]
                                }
                            ]
                        }
                    },
                    "liveness": {
                        "order": 3,
                        "show": true,
                        features: { provider: 1 }
                    },
                    "videoagreement": {
                        "order": 4,
                        "show": true,
                        "input": {
                            "legend": "Yo client.name acepto que todos los datos proporcionados son verídicos."
                        }
                    }
                },
                customization: {
                    theme: [
                        { "key": "--fad-common-primary-color", "value": "#47f00cd" },
                        { "key": "--fad-common-secondary-color", "value": "#ff00a9" },
                        { "key": "--fad-common-tertiary-color", "value": "#7801da" },
                        { "key": "--fad-common-primary-button-background-color", "value": "#6301FF" },
                        { "key": "--fad-common-primary-button-label-color", "value": "#F3F0FF" },
                        { "key": "--fad-common-secondary-button-background-color", "value": "#FFFFFF" },
                        { "key": "--fad-common-secondary-button-label-color", "value": "#6301FF" },
                        { "key": "--fad-common-secondary-button-border-color", "value": "#6301FF" },
                        { "key": "--fad-common-button-common-background-color-disabled", "value": "#BBA5FF" },
                        { "key": "--fad-common-button-common-label-color-disabled", "value": "#F3F0FF" },
                        { "key": "--fad-common-button-common-border-radius", "value": "15px" },
                        { "key": "--fad-common-legends-color", "value": "#ffffff" }
                    ],
                    header: [
                        { "type": "IMG", "content": "https://iili.io/2xw4RMN.png" }
                    ]
                },
                notifications: {
                    email: true
                }
            };

            // Realiza la petición POST para crear la validación
            const response = await axios.post(
                'https://uat.firmaautografa.com/validation/createValidation',
                validationBody,
                { headers }
            );
            console.log('response try;', response.data)

            const id_fad = await fadModel.registerValidationData(req.user.id_usuario, response.data.data)

            // Devuelve la respuesta del servidor
            res.status(200).json([response.data, id_fad]);  
        } catch (error) {
            console.log('error try;', error)
            res.status(500).json({ error: 'Error al crear la validación', details: error });
        }
    },
    getValidationStep: async (req, res) => {
        try {
            const accessToken = req.fad.accessToken;
            const authorizationHeader = `Bearer ${accessToken}`
            const validationid_fad = await fadModel.getValidationID(req.user.id_usuario)


            const headers = {
                'Authorization': authorizationHeader,
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            };

            // Realiza la petición GET para obtener el estado de la validación
            const response = await axios.get(
                `https://uat.firmaautografa.com/validation/getValidationStep/${validationid_fad.validationid_fad}`,
                { headers }
            );
            if (response.data.validation.status === "FINISHED") {
                const ocr_data = formatFAD.ocr(response.data.steps.captureId.data.ocr);
                const apiResponse = await fadModel.registerValidationData(req.user.id_usuario, ocr_data);
                await verificacionModel.updateIDVerificationStatus(req.user.id_usuario, true);
                await verificacionModel.updateIdentityVerificationStatus(req.user.id_usuario, true);
                await usuarioModel.updateVerificacionStepStatus(userId, 'simulacion modelos');
                res.status(200).json(
                    {
                        status:'success',
                        message: 'Validación finalizada con éxito',
                    }
                );
            } else {
                res.status(200).json({
                    status:'in progress',
                    message: 'Validación en progreso, por favor ingresa al link que recibiste en tu correo y termina el proceso de verificacion',
                });
            }
        } catch (error){
            res.status(500).json({ error: 'Error al obtener el estado de la validación', details: error });
        }
    }, 
    getValidationData: async (req, res) => {
        try {
            const accessToken = req.fad.accessToken;
            const authorizationHeader = `Bearer ${accessToken}`
            const validationid_fad = await fadModel.getValidationID(req.user.id_usuario)

            const headers = {
                'Authorization': authorizationHeader,
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }; 

            // Realiza la petición GET para obtener los datos de la validación
            const response = await axios.get(
                `https://uat.firmaautografa.com/validation/validations/getValidationData/${validationid_fad.validationid_fad}`,
                { headers }
            );
            res.status(200).json(response.data);
        } catch (error) {
            console.log('error try;', error)
            res.status(500).json({ error: 'Error al obtener los datos de la validación', details: error });
        }
    }, 
};

module.exports = FADController;