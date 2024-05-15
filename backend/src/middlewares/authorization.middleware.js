"use strict";
/* <----------------------- MODELOS --------------------------> */
const User = require("../models/user.model.js");
const Role = require("../models/role.model.js");

/* <----------------------- FUNCIONES ------------------------> */
// Funciones que manejan las respuestas HTTP exitosas/erroneas.
const { respondError } = require("../utils/resHandler.js");
// handleError: Funcion de registro y manejo de errores de manera centralizada 
const { handleError } = require("../utils/errorHandler.js");

/**
 * Comprueba si el usuario es administrador
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Función para continuar con la siguiente función
 */
async function isAdmin(req, res, next) {
  try {
    const user = await User.findOne({ email: req.email });

    const roles = await Role.find({ _id: { $in: user.roleUser } });

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].nameRole === "Administrador") {
        next();
        return;
      }
    }
    return respondError( req, res, 401, "Se requiere un rol de administrador para realizar esta acción" );
  } catch (error) {
    handleError(error, "authorization.middleware -> isAdmin");
  }
}

module.exports = {
  isAdmin,
};
