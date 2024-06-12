/* <----------------------- MODELOS --------------------------> */
const Hashtag = require("../models/hashtag.model");
const User = require("../models/user.model");

/* <----------------------- FUNCIONES ------------------------> */
// handleError: Funcion de registro y manejo de errores de manera centralizada 
const { handleError } = require("../utils/errorHandler.js")

/**
 * Servicio encargado de crear un nuevo hashtag.
 * @param {Object} hashtag - Objeto que contiene la información del nuevo hashtag.
 * @param {string} hashtag.nameHashtag - Nombre del hashtag a crear.
 * @returns {Promise<Array>} Retorna un array con el nuevo hashtag creado `[newHashtag, null]` o un mensaje de error si no se pudo crear `[null, error]`.
 */
async function createHashtag(hashtag){
    try{
        let { nameHashtag } = hashtag;
        nameHashtag = nameHashtag.toLowerCase();
        const hashtagExists = await Hashtag.findOne({nameHashtag: nameHashtag});
        if(hashtagExists) return [null, "Hashtag ya existe"];
        const newHashtag = new Hashtag({nameHashtag});
        await newHashtag.save();
        return [newHashtag, null];
    } catch(error){
        handleError(error, "hashtag.service -> createHashtag")
    }
}
/**
 * Servicio que obtiene todos los hashtags de la base de datos.
 * @returns {Promise<Array>}  Retorna un array con todos los hashtags `[hashtags, null]` o un mensaje de error si no se encontraron hashtags `[null, error]`.
 */
async function getHashtags(){
    try {
        const hashtags = await Hashtag.find();
        if(!hashtags) return [null, "No se encontraron hashtags en la bbdd"];
        return [hashtags, null];
    } catch (error) {
        handleError(error, "hashtag.service -> getHashtags")
    }
}
/**
 * Servicio que obtiene un hashtag por su ID de la base de datos.
 * @param {string} id - ID del hashtag a buscar.
 * @returns {Promise<Array>} - Retorna un array con el hashtag encontrado `[hashtag, null]` o un mensaje de error si el hashtag no fue encontrado `[null, error]`.
 */
async function getHashtagById(id){
    try{
        const hashtag = await Hashtag.findById(id);
        if(!hashtag) return [null, "Hashtag no encontrado"];
        return [hashtag, null];
    } catch(error){
        handleError(error, "hashtag.service -> getHashtag")
    }
}
/**
 * Servicio que se encarga de actualizar un hashtag existente en la base de datos.
 * @param {string} id - ID del hashtag a actualizar.
 * @param {Object} hashtag - Objeto que contiene los nuevos datos del hashtag a actualizar.
 * @returns {Promise<Array>} - Retorna un array con el hashtag actualizado `[updatedHashtag, null]` o un mensaje de error si no se pudo actualizar `[null, error]`.
 */
async function updateHashtag(id, hashtag){
    try{

    }catch(error){
        handleError(error, "hashtag.service -> updateHashtag")
    }
}
/**
 * Serivicio para eliminar un hashtag de la base de datos.
 * @param {string} id - ID del hashtag a eliminar.
 * @returns {Promise<Array>} - Retorna un array con el hashtag eliminado `[deletedHashtag, null]` o un mensaje de error si no se pudo eliminar `[null, error]`.
 */
async function deleteHashtag(id){
    try{
        const hashtag = await Hashtag.findByIdAndDelete(id);
        if(!hashtag) return [null, "Hashtag no encontrado"];
        return [hashtag, null];
    } catch(error){
        handleError(error, "hashtag.service -> deleteHashtag")
    }
}

async function userFollowHashtag(userId, hashtagId){
    try{
        const hashtag = await Hashtag.findById(hashtagId);
        if(!hashtag) return [null, "Hashtag no encontrado"];

        const user = await User.findById(userId);
        if(!user) return [null, "Usuario no encontrado"];

        const isFollowedByUser = hashtag.followedBy.some(
            (followedUser) => followedUser.toString() === userId
        )

        if(isFollowedByUser){
            return [null, "El usuario ya sigue este hashtag"];
        }

        hashtag.followedBy.push(userId);
        await hashtag.save();

        const isHashtagFollowedByUser = user.followedHashtags.some(
            (followedHashtag) => followedHashtag.toString() === hashtagId
        );

        if(!isHashtagFollowedByUser){
            user.followedHashtags.push(hashtagId);
            await user.save();
        }

        return [hashtag, null];
    } catch(error){
        handleError(error, "hashtag.service -> userFollowHashtag")
    }
}

async function userUnfollowHashtag(userId, hashtagId){
    try{
        const hashtag = await Hashtag.findById(hashtagId);
        if(!hashtag) return [null, "Hashtag no encontrado"];
        const user = await User.findById(userId);
        if(!user) return [null, "Usuario no encontrado"];
        const userIndexInHashtag = hashtag.followedBy.indexOf(userId);
        if(userIndexInHashtag > -1) {
            hashtag.followedBy.splice(userIndexInHashtag, 1);
            await hashtag.save();
        } else {
            return [null, "El usuario no sigue este hashtag"];
        }

        const hashtagIndexInUser = user.followedHashtags.indexOf(hashtagId);
        if(hashtagIndexInUser > -1) {
            user.followedHashtags.splice(hashtagIndexInUser, 1);
            await user.save();
        } else {
            return [null, "El hashtag no está en la lista de seguidos del usuario"];
        }

        return [hashtag, null];
    } catch(error){
        handleError(error, "hashtag.service -> userUnfollowHashtag")
    }
}

module.exports = {
    createHashtag,
    getHashtags,
    getHashtagById,
    updateHashtag,
    deleteHashtag,
    userFollowHashtag,
    userUnfollowHashtag
}