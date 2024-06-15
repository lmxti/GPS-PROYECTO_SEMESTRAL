require('dotenv').config();

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

async function sendResetPasswordEmail(user, token) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Restablecimiento de contraseña',
        text: `Hola ${user.name},\n\n` +
              'Recibiste este correo electrónico porque tú (u otra persona) ha solicitado restablecer la contraseña de tu cuenta.\n\n' +
              'Por favor, haz clic en el siguiente enlace, o pega este en tu navegador para completar el proceso:\n\n' +
              `http://localhost:3000/reset/${token}\n\n` +
              'Si no solicitaste esto, por favor ignora este correo electrónico y tu contraseña permanecerá sin cambios.\n'
    };

    await transporter.sendMail(mailOptions);
}

module.exports = {
    sendResetPasswordEmail
};