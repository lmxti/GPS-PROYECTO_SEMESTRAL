"use strict";
/* <----------------------- MODULOS --------------------------> */
// jwt: Modulo para generacion y verificacion de tokens 
const jwt = require("jsonwebtoken");

/* <--------------------- V. DE ENTORNO ----------------------> */
const { ACCESS_JWT_SECRET } = require("../config/env.config.js");

/* <----------------------- FUNCIONES ------------------------> */
// handleError: Funcion de registro y manejo de errores de manera centralizada 
const { handleError } = require("../utils/errorHandler.js");
// respondError: Funcion para dar respuesta de errores estandarizada
const { respondError } = require("../utils/resHandler");

/**
 * Verifica el token de acceso
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Función para continuar con la siguiente función
 */
const verifyJWT = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return respondError( req, res, 401, "No autorizado","Token Bearer no valido,");
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, ACCESS_JWT_SECRET, (err, decoded) => {
      if (err) return respondError(req, res, 403, "No autorizado", err.message);
      req.email = decoded.email;
      req.roles = decoded.roles;
      next();
    });
  } catch (error) {
    handleError(error, "authentication.middleware -> verifyToken");
  }
};

module.exports = verifyJWT;
