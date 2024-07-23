/* <----------------------- SERVICIOS ------------------------> */
const SearchService = require("../services/search.service.js");

/* <----------------------- FUNCIONES ------------------------> */
// Funciones que manejan las respuestas HTTP exitosas/erroneas.
const { respondSuccess, respondError } = require("../utils/resHandler.js");
// handleError: Funcion de registro y manejo de errores de manera centralizada 
const { handleError } = require("../utils/errorHandler.js");


/**
 * Realiza una búsqueda de usuarios basada en la consulta proporcionada.
 * @param {Object} req - Objeto de solicitud que contiene la consulta de búsqueda en `req.query.q`.
 * @param {Object} res - Objeto de respuesta para enviar los resultados de la búsqueda.
 * @returns {Promise<void>}
 */
async function search(req, res){
    try {
        const { q } = req.query;
        if(!q) return respondError(req, res, 400, "Se requiere termino de busqueda");
        const [users, searchError] = await SearchService.searchUsers(q);
        if(searchError) return respondError(req, res, 400, searchError);
        if(!users || users.length === 0) return respondError(req, res, 404, "No se encontraron usuarios");
        respondSuccess(req, res, 200, { message: "Busqueda exitosa", data: users});
    } catch (error) {
        handleError(error, "search.controller -> searchUsers");
        respondError(req, res, 500, "Error al realizar la búsqueda de usuarios");
    }
}



module.exports = {
    search
}