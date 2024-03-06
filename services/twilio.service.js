const { TWILIO_SERVICE_SID, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, { lazyLoading: true });

const sendOTP_Email = async (email) => {
    try {
        const verificationSendResponse = await client.verify.v2
            .services(TWILIO_SERVICE_SID)
            .verifications.create({
                to: email,
                channel: 'email',
            });
        return verificationSendResponse;
    } catch (err) {
        throw err;
    }
};

const verifyOTP_Email = async (email, code) => {
    try {
        const verificationCheck = await client.verify.v2
            .services(TWILIO_SERVICE_SID)
            .verificationChecks.create({
                to: email,
                code: code,
            });

        return verificationCheck;
    } catch (err) {
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
        return otpResponse;
    } catch (err) {
        throw err;
    }
};

const verifyOTP_PhoneNumber = async (phoneNumber, code) => {
    try {
        const otpResponse = await client.verify.v2
            .services(TWILIO_SERVICE_SID)
            .verificationChecks.create({
                to: phoneNumber,
                code: code
            });
        return otpResponse;
    } catch (err) {
        throw err;
    }
};

module.exports = {
    sendOTP_Email,
    verifyOTP_Email,
    sendOTP_PhoneNumber,
    verifyOTP_PhoneNumber
}