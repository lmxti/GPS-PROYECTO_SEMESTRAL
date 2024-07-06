/* <----------------------- SERVICIOS ------------------------> */
const visualizationService = require('../services/visualization.service');
/* <----------------------- FUNCIONES ------------------------> */
const { respondSuccess, respondError } = require("../utils/resHandler.js");
const { handleError } = require("../utils/errorHandler.js");

/**
 * Maneja las solicitudes HTTP GET a la ruta `/search`. Toma un parámetro de consulta `q` de la solicitud,
 * que se utiliza como término de búsqueda. Luego, llama al método `visualizationService.searchPosts()` con este término de búsqueda.
 * @param {Object} req - Objeto de solicitud (request) que contiene el término de búsqueda en `req.query.q`.
 * @param {Object} res - Objeto de respuesta (response) que contiene información sobre la respuesta HTTP.
 * @returns {Promise<void>} Promesa que no devuelve ningún valor explícito.
 */
async function searchPosts(req, res) {
    try {
        const query = req.query.q;
        const [posts, error] = await visualizationService.searchPosts(query);
        if (error) return respondError(req, res, 400, error);
        respondSuccess(req, res, 200, posts);
    } catch (error) {
        handleError(error, "visualization.controller -> searchPosts");
        respondError(req, res, 500, "Error al buscar publicaciones");
    }
}
/**
 * Maneja las solicitudes HTTP GET a la ruta `/trending`. Toma el ID del usuario de la solicitud,
 * que se utiliza para obtener las publicaciones en tendencia para ese usuario. Luego, llama al método `visualizationService.getTrendingPosts()` con este ID de usuario.
 * @param {Object} req - Objeto de solicitud (request) que contiene el ID del usuario en `req.user.id`.
 * @param {Object} res - Objeto de respuesta (response) que contiene información sobre la respuesta HTTP.
 * @returns {Promise<void>} Promesa que no devuelve ningún valor explícito.
 */
async function getTrendingPosts(req, res) {
    try {
        const userId = req.user.id;
        const [posts, error] = await visualizationService.getTrendingPosts(userId);
        if (error) return respondError(req, res, 400, error);
        respondSuccess(req, res, 200, posts);
    } catch (error) {
        handleError(error, "visualization.controller -> getTrendingPosts");
        respondError(req, res, 500, "Error al obtener publicaciones en tendencia");
    }
}

/**
 * Maneja las solicitudes HTTP GET a la ruta `/followed`. Toma el ID del usuario de la solicitud,
 * que se utiliza para obtener las publicaciones de usuarios y hashtags seguidos por ese usuario. Luego, llama al método `visualizationService.getFollowedPosts()` con este ID de usuario.
 * @param {Object} req - Objeto de solicitud (request) que contiene el ID del usuario en `req.user.id`.
 * @param {Object} res - Objeto de respuesta (response) que contiene información sobre la respuesta HTTP.
 * @returns {Promise<void>} Promesa que no devuelve ningún valor explícito.
 */
async function getFollowedPosts(req, res) {
    try {
        const userId = req.user.id;
        const [posts, error] = await visualizationService.getFollowedPosts(userId);
        if (error) return respondError(req, res, 400, error);
        respondSuccess(req, res, 200, posts);
    } catch (error) {
        handleError(error, "visualization.controller -> getFollowedPosts");
        respondError(req, res, 500, "Error al obtener publicaciones seguidas");
    }
}

module.exports = {
    searchPosts,
    getTrendingPosts,
    getFollowedPosts
}