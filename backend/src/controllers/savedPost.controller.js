const SavedPostService = require('../services/savedPosts.service.js');

async function savePost(req, res) {
    const userId = req.params.id;
    const postId = req.body.postId;

    try {
        const [user, userError] = await SavedPostService.savePost(userId, postId);
        if(userError) return respondError(req, res, 400, userError);
        if(!user) return respondError(req, res, 400, "No se encontró usuario asociado al id ingresado");
        respondSuccess(req, res, 200, { message: "Publicación guardada", data: user});
    } catch (error) {
        handleError(error, "savedPosts.controller -> savePost");
        respondError(req, res, 500, "No se pudo guardar la publicación")
    }
}

async function getSavedPosts(req, res) {
    const userId = req.params.id;

    try {
        const [posts, postsError] = await SavedPostService.getSavedPosts(userId);
        if(postsError) return respondError(req, res, 400, postsError);
        if(!posts) return respondError(req, res, 400, "No se encontró usuario asociado al id ingresado");
        respondSuccess(req, res, 200, { message: "Publicaciones guardadas obtenidas", data: posts});
    } catch (error) {
        handleError(error, "savedPosts.controller -> getSavedPosts");
        respondError(req, res, 500, "No se pudieron obtener las publicaciones guardadas")
    }
}

async function removeSavedPost(req, res) {
    const userId = req.params.id;
    const postId = req.body.postId;

    try {
        const [user, userError] = await SavedPostService.removeSavedPost(userId, postId);
        if(userError) return respondError(req, res, 400, userError);
        if(!user) return respondError(req, res, 400, "No se encontró usuario asociado al id ingresado");
        respondSuccess(req, res, 200, { message: "Publicación eliminada", data: user});
    } catch (error) {
        handleError(error, "user.controller -> removeSavedPost");
        respondError(req, res, 500, "No se pudo eliminar la publicación")
    }
}

module.exports = {
    savePost,
    getSavedPosts,
    removeSavedPost
}