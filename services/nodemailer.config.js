const nodemailer = require('nodemailer');
const dotenv = require('dotenv')
dotenv.config()

const user = process.env.BURS_EMAIL
const pass = process.env.BURS_EMAIL_PASSWORD

host = process.env.BURS_HOST
port = process.env.BURS_PORT

const transporter = nodemailer.createTransport({
    host: host,
    port: port,
    secure: true,
    auth: {
        user: user,
        pass: pass
    }
});

module.exports = transporter;
