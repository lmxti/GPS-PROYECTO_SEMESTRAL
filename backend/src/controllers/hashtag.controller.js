/* <----------------------- SERVICIOS ------------------------> */
const HashtagService = require("../services/hashtag.service.js");
/* <----------------------- SCHEMA ------------------------> */
const { hashtagBodySchema } = require("../schema/hashtag.schema.js");
/* <----------------------- FUNCIONES ------------------------> */
// Funciones que manejan las respuestas HTTP exitosas/erroneas.
const { respondSuccess, respondError } = require("../utils/resHandler.js");
// handleError: Funcion de registro y manejo de errores de manera centralizada
const { handleError } = require("../utils/errorHandler.js");

async function createHashtag(req, res){
    try{
        const { body } = req;
        const { error: bodyError } = hashtagBodySchema.validate(body);
        if (bodyError) return respondError(req, res, 400, bodyError.message);

        const [newHashtag, hashtagError] = await HashtagService.createHashtag(body);
        if (hashtagError) return respondError(req, res, 400, hashtagError);
        if (!newHashtag) return respondError(req, res, 400, "No se creo el hashtag");
        respondSuccess(req, res, 201, newHashtag);
    } catch(error){
        handleError(error, "hashtag.controller -> createHashtag");
        respondError(req, res, 500, "No se creo hashtag");
    }
}

async function getHashtags(req, res){
    try {
        const [hashtags, errorHashtags] = await HashtagService.getHashtags();
        if (errorHashtags) return respondError(res, 500, "Error al buscar hashtags");
        hashtags.length === 0
            ? respondSuccess(req, res, 200, "No existen hashtags en la bbdd")
            : respondSuccess(req, res, 200, { message: "Se encontraron los siguientes hashtags: ", data: hashtags})
    } catch (error) {
        handleError(error, "hashtag.controller -> getHashtags");
        respondError(req, res, 500, "No se pudo encontrar hashtags");
    }
}

async function getHashtagById(req, res){
    try{
        const {params} = req;
        const [ hashtag, hashtagError ] = await HashtagService.getHashtag(params.id);
        if(hashtagError) return respondError(req, res, 404, hashtagError);
        respondSuccess(req, res, 200, hashtag);
    } catch(error){
        handleError(error, "hashtag.controller -> getHashtag");
        respondError(req, res, 500, "No se pudo encontrar hashtag");
    }
}

async function updateHashtag(req, res){
    try {
        const { id } = req.params;
        const { body } = req;
        const [hashtag, hashtagError] = await HashtagService.updateHashtag(id, body);
        if(hashtagError) return respondError(req, res, 400, hashtagError);
        if(!hashtag) return respondError(req, res, 400, "No se encontro hashtag asociado al id ingresado");
        respondSuccess(req, res, 200, { message: "Hashtag actualizado", data: hashtag});
    } catch (error) {
        handleError(error, "hashtag.controller -> updateHashtag");
        respondError(req, res, 500, "No se actualizo hashtag")
    }
}

async function deleteHashtag(req, res){
    try{
        const { params } = req;
        const [hashtag, hashtagError] = await HashtagService.deleteHashtag(params.id);
        if(hashtagError) return respondError(req, res, 404, hashtagError);
        respondSuccess(req, res, 200, { message: "Hashtag eliminado", data: hashtag});
    } catch(error){
        handleError(error, "hashtag.controller -> deleteHashtag");
        respondError(req, res, 500, "No se pudo eliminar hashtag");
    }
}

module.exports = {
    createHashtag,
    getHashtags,
    getHashtagById,
    updateHashtag,
    deleteHashtag
}