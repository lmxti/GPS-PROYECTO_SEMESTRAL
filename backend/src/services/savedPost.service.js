
const User = require("../models/user.model");
const Post = require('../models/post.model');

const { handleError } = require('../helpers/error');

async function savePost(userId, postId) {
    try {
        const user = await User.findById(userId);
        if (!user) {
            return [null, "No se encontró usuario asociado al id ingresado"];
        }

        const post = await Post.findById(postId);
        if (!post) {
            return [null, "No se encontró publicación asociada al id ingresado"];
        }

        // Verificar si la publicación ya está guardada
        if (user.savedPosts.includes(postId)) {
            return [null, "La publicación ya está guardada"];
        }

        // Agregar la publicación al usuario
        user.savedPosts.push(postId);

        // Guardar el usuario
        await user.save();

        return [user, null];
    } catch (error) {
        handleError(error, "user.service -> savePost");
        return [null, "No se pudo guardar la publicación"];
    }
}


async function getSavedPosts(userId) {
    try {
        const user = await User.findById(userId).populate('savedPosts');
        if (!user) {
            return [null, "No se encontró usuario asociado al id ingresado"];
        }

        return [user.savedPosts, null];
    } catch (error) {
        handleError(error, "user.service -> getSavedPosts");
        return [null, "No se pudieron obtener las publicaciones guardadas"];
    }
}

async function removeSavedPost(userId, postId) {
    try {
        const user = await User.findById(userId);
        if (!user) {
            return [null, "No se encontró usuario asociado al id ingresado"];
        }

        const postIndex = user.savedPosts.indexOf(postId);
        if (postIndex === -1) {
            return [null, "La publicación no está en la lista de publicaciones guardadas"];
        }

        // Eliminar la publicación de la lista de publicaciones guardadas
        user.savedPosts.splice(postIndex, 1);

        // Guardar el usuario
        await user.save();

        return [user, null];
    } catch (error) {
        handleError(error, "user.service -> removeSavedPost");
        return [null, "No se pudo eliminar la publicación"];
    }
}

module.exports = {
    savePost,
    getSavedPosts,
    removeSavedPost
}