/* <----------------------- SERVICIOS ------------------------> */
const AuthService = require("../services/auth.service.js");

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

module.exports = {
    login,
    logout,
    refresh
}