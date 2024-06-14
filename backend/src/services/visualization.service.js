const Post = require('../models/post.model');
const User = require('../models/user.model');
const { handleError } = require('../helpers/error');

/**
 * Servicio de busqueda de contenido en las publicaciones por usuario, hashtags, título y descripción
 * @param {string} query - El término de búsqueda.
 * @returns {Promise<Array>} Promesa que resuelve a un arreglo que contiene `[posts, null] si tiene éxito o `[null, mensaje de error]` si falla.
 */
async function searchPosts(query) {
    try {
        const user = await User.findOne({ username: { $regex: query, $options: 'i' } });
        const posts = await Post.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { hashtags: { $regex: query, $options: 'i' } },
                { author: user ? user._id : null }
            ]
        });

        if(!posts.length) return [null, `No se encontraron publicaciones con el término de búsqueda: ${query}`];
        return [posts, null];
    } catch (error) {
        handleError(error, "post.service -> searchPosts");
    }
}

/**
 * Servicio para obtener las publicaciones de usuarios y hashtags seguidos, ordenadas por tendencias
 * @param {string} userId - El ID del usuario.
 * @returns {Promise<Array>} Promesa que resuelve a un arreglo que contiene `[posts, null] si tiene éxito o `[null, mensaje de error]` si falla.
 */
async function getTrendingPosts(userId) {
    try {
        const user = await User.findById(userId);
        if (!user) return [null, `No se encontró al usuario con el ID: ${userId}`];

        const followedUsersPosts = await Post.find({ author: { $in: user.followed } });
        const followedHashtagsPosts = await Post.find({ hashtags: { $in: user.followedHashtags } });

        const posts = followedUsersPosts.concat(followedHashtagsPosts);

        posts.sort((a, b) => (b.comments.length + b.interactions.length) - (a.comments.length + a.interactions.length));

        return [posts, null];
    } catch (error) {
        handleError(error, "post.service -> getTrendingPosts");
    }
}

/**
 * Servicio para obtener las publicaciones de usuarios y hashtags seguidos
 * @param {string} userId - El ID del usuario.
 * @returns {Promise<Array>} Promesa que resuelve a un arreglo que contiene `[posts, null] si tiene éxito o `[null, mensaje de error]` si falla.
 */
async function getFollowedPosts(userId) {
    try {
        const user = await User.findById(userId);
        if (!user) return [null, `No se encontró al usuario con el ID: ${userId}`];

        const followedUsersPosts = await Post.find({ author: { $in: user.followed } });
        const followedHashtagsPosts = await Post.find({ hashtags: { $in: user.followedHashtags } });

        const posts = followedUsersPosts.concat(followedHashtagsPosts);

        return [posts, null];
    } catch (error) {
        handleError(error, "post.service -> getFollowedPosts");
    }
}


module.exports = {
    searchPosts,
    getTrendingPosts,
    getFollowedPosts
}