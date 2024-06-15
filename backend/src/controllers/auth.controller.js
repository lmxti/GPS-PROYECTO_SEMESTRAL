/* <----------------------- SERVICIOS ------------------------> */
const AuthService = require("../services/auth.service.js");
const EmailService = require('../services/email.service.js');
/* <----------------------- MODELOS --------------------------> */
const User = require("../models/user.model.js");

/* <------------------------- SCHEMA --------------------------> */
const { authLoginBodySchema } = require("../schema/auth.shcema.js");

/* <----------------------- FUNCIONES ------------------------> */
// Funciones que manejan las respuestas HTTP exitosas/erroneas.
const { respondError, respondSuccess } = require("../utils/resHandler.js");
// handleError: Funcion de registro y manejo de errores de manera centralizada 
const { handleError } = require("../utils/errorHandler.js");

/**
 * Controlador para la autenticacion(inicio de sesion) de usuarios.
 * @param {Object} req - Objeto de solitiud (request) para iniciar sesion.
 * @param {Object} res - Objeto de respuesta (response) que contine informacion sobre respuesta HTTP.
 * @returns {Promise<void>} Promesa que no devuelve ningun valor explicito
 */
async function login(req, res){
    try {
        const { body } = req;
        const { error: bodyError } = authLoginBodySchema.validate(body);
        if(bodyError) return respondError(req, res, 400, bodyError.message);

        const [accessToken, refreshToken, errorToken ] = await AuthService.login(body);
        if(errorToken) return respondError(req, res, 400, errorToken);

        res.cookie("jwt", refreshToken, { httpOnly: true, maxAge: 7 * 24* 60 * 60 * 1000 });
        respondSuccess(req, res, 200, { accessToken });
    } catch (error) {
        handleError(error, "auth.controller -> login");
        respondError(req, res, 400, error.message);
    }
}
/**
 * Controlador para cerrar sesion de usuarios.
 * @param {Object} req - Objeto de solitiud (request) cerrar sesion de usuario.
 * @param {Object} res - Objeto de respuesta (response) que contine informacion sobre respuesta HTTP.
 * @returns {Promise<void>} Promesa que no devuelve ningun valor explicito
 */
async function logout(req, res){
    try {
        const cookies = req.cookies;
        if(!cookies?.jwt) return respondError(req, res, 400, "No hay token existente");

        res.clearCookie("jwt", { httpOnly: true});
        respondSuccess(req, res, 200, { message: "Sesion cerrada correctamente"});
    } catch (error) {
        handleError(error, "auth.controller -> logout");
        respondError(req, res, 400, error.message);
    }
}
/**
 * Controlador para refrescar el token de acceso de un usuario.
 * @param {Object} req - Objeto de solitiud (request) para refrescar token de usuario.
 * @param {Object} res - Objeto de respuesta (response) que contine informacion sobre respuesta HTTP.
 * @returns {Promise<void>} Promesa que no devuelve ningun valor explicito
 */
async function refresh(req, res) {
    try {
      const cookies = req.cookies;
      if (!cookies?.jwt) return respondError(req, res, 400, "No hay token");

      const [accessToken, errorToken] = await AuthServices.refresh(cookies);
      if (errorToken) return respondError(req, res, 400, errorToken);

      respondSuccess(req, res, 200, { accessToken });
    } catch (error) {
      handleError(error, "auth.controller -> refresh");
      respondError(req, res, 400, error.message);
    }
}

/**
 * Controlador para manejar el olvido de contraseña de un usuario.
 * @param {Object} req - Objeto de solicitud (request) que contiene la información del usuario.
 * @param {Object} res - Objeto de respuesta (response) que contiene información sobre la respuesta HTTP.
 * @returns {Promise<void>} Promesa que no devuelve ningún valor explícito
 */
async function forgotPassword(req, res) {
    try {
        const { email } = req.body;
        if (!email) {
            return respondError(req, res, 400, "Se requiere correo electrónico");
        }

        // Generar token y guardar en la base de datos
        const [user, errorToken] = await AuthService.generateResetToken(email);
        if (errorToken) {
            return respondError(req, res, 400, errorToken);
        }

        // Enviar correo electrónico con el enlace de restablecimiento de contraseña
        const resetUrl = `${req.protocol}://${req.get('host')}/resetPassword/${user.resetPasswordToken}`;
        await EmailService.sendResetPasswordEmail(user, resetUrl);

        respondSuccess(req, res, 200, { message: "Correo electrónico de restablecimiento de contraseña enviado" });
    } catch (error) {
        handleError(error, "auth.controller -> forgotPassword");
        respondError(req, res, 500, error.message);
    }
}

/**
 * Controlador para manejar el restablecimiento de contraseña de un usuario.
 * @param {Object} req - Objeto de solicitud (request) que contiene la información del usuario.
 * @param {Object} res - Objeto de respuesta (response) que contiene información sobre la respuesta HTTP.
 * @returns {Promise<void>} Promesa que no devuelve ningún valor explícito
 */
async function resetPassword(req, res) {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            return respondError(req, res, 400, "Se requiere token y nueva contraseña");
        }

        // Restablecer la contraseña y guardar en la base de datos
        const [user, errorReset] = await AuthService.resetPassword(token, newPassword);
        if (errorReset) {
            return respondError(req, res, 400, errorReset);
        }

        respondSuccess(req, res, 200, { message: "Contraseña restablecida con éxito" });
    } catch (error) {
        handleError(error, "auth.controller -> resetPassword");
        respondError(req, res, 400, error.message);
    }
}

module.exports = {
    login,
    logout,
    refresh,
    forgotPassword,
    resetPassword
}