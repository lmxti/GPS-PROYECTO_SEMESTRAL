const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
const { handleError } = require("../utils/errorHandler.js")

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendMail(email, subject, text) {
    try {
        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            text: text
        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        handleError(error, "mailer.service -> sendMail");
    }
}

module.exports = { sendMail }
