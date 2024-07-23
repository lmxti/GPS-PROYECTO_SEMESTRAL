/* <----------------------- MODELOS --------------------------> */
const Post = require("../models/post.model");
const User = require("../models/user.model");
const Hashtag = require("../models/hashtag.model.js");

/* <----------------------- FUNCIONES ------------------------> */
// handleError: Funcion de registro y manejo de errores de manera centralizada 
const { handleError } = require("../utils/errorHandler.js");

/**
 * Busca usuarios basados en el término de búsqueda.
 * @param {string} query - Término de búsqueda.
 * @returns {Promise<Array>} Promesa que resuelve a un arreglo que contiene `[users, null]` si tiene éxito o `[null, mensaje de error]` si falla.
 */
async function searchUsers(query) {
    try {
        const users = await User.find({ 
            $or: [
                { username: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        })
        .select('username name surname email profilePicture')
        .limit(10);

        return [users, null];
    } catch (error) {
        handleError(error, "search.service -> searchUsers");
        return [null, "Error al buscar usuarios"];
    }
}

module.exports = {
    searchUsers
};