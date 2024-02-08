const { TWILIO_SERVICE_SID, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, { lazyLoading: true });

const sendOTP_Email = async (email) => {
    try {
        const verificationResponse = await client.verify.v2
            .services(TWILIO_SERVICE_SID)
            .verifications.create({
                to: email,
                channel: 'email',
            });

        //console.log(`OTP verificado exitosamente: ${JSON.stringify(otpResponse)}`);
    } catch (err) {
        console.error('Error al enviar el correo de verificación:', err);
        throw err;
    }
};

const verifyOTP_Email = async (email, code) => {
    try {
        const verificationCheck = await twilioClient.verify.v2
            .services(TWILIO_SERVICE_SID)
            .verificationChecks.create({
                to: email,
                code: code,
            });

        return verificationCheck;
    } catch (err) {
        console.error('Error al verificar el correo electrónico:', err);
        throw err;
    }
};  

const sendOTP_PhoneNumber = async (phoneNumber) => {
    try {
        const otpResponse = await client.verify.v2
            .services(TWILIO_SERVICE_SID)
            .verifications
            .create({
                to: phoneNumber,
                channel: 'sms'
            });
        console.log(`OTP verificado exitosamente: ${JSON.stringify(otpResponse)}`);
    } catch (err) {
        console.error(err);
        throw err;
    }
};

module.exports = {
    sendOTP_Email,
    verifyOTP_Email,
    sendOTP_PhoneNumber
}