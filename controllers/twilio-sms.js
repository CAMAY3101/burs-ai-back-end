const {TWILIO_SERVICE_SID, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN} = process.env;
const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, { lazyLoading: true });

const sendOTP = async (req, res, next) => {
    const {countryCode, phoneNumber} = req.body;
    try {
        const otpResponse = await client.verify.v2 
            .services(TWILIO_SERVICE_SID)
            .verifications
            .create({
                to: `+${countryCode}${phoneNumber}`, 
                channel: 'sms'
            });
        res.status(200).send(`OTP verified successfully: $(JSON.stringify(otpResponse))`);
    }catch(err){
        console.error(err);
        res.status(err?.status || 400).send(err?.message || 'Error sending OTP');
    }
};

/**
 * verify OTP
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const verifyOTP = async (req, res, next) => {
    const {countryCode, phoneNumber, code} = req.body;
    try {
        const otpResponse = await client.verify.v2
            .services(TWILIO_SERVICE_SID)
            .verificationChecks.create({
                to: `+${countryCode}${phoneNumber}`,
                code: code
            });
        res.status(200).send(`OTP verified successfully: $(JSON.stringify(otpResponse))` );
    }catch(err){
        console.error(err);
        res.status(500).json({error: 'Error verifying OTP'});
    }
}

module.exports = {
    sendOTP,
    verifyOTP
}