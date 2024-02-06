const sgMail = require('@sendgrid/mail');
const dotenv = require('dotenv')
dotenv.config()

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Create a function to send an email
const sendEmail = async (email, verificationLink) => {
    const msg = {
        to: email,
        from: {
            name:  "Burs",
            email: process.env.BURS_EMAIL
        } , // Use the email address or domain you verified above
        templateId: process.env.SENDGRID_TEMPLATE_ID,
        dynamicTemplateData: {
            verification_link: verificationLink
        }
    };

    try {
        await sgMail.send(msg);
        console.log('Correo enviado');
    } catch (error) {
        console.error('Error al enviar el correo:', error.response.body);
    }
}

module.exports = {sendEmail};
