/* <----------------------- MODELOS --------------------------> */
const Hashtag = require("../models/hashtag.model");

/* <----------------------- FUNCIONES ------------------------> */
// handleError: Funcion de registro y manejo de errores de manera centralizada 
const { handleError } = require("../utils/errorHandler.js")

async function createHashtag(hashtag){
    try{
        const { nameHashtag } = hashtag;
        const hashtagExists = await Hashtag.findOne({nameHashtag: nameHashtag});
        if(hashtagExists) return [null, "Hashtag ya existe"];
        const newHashtag = new Hashtag({nameHashtag});
        await newHashtag.save();
        return [newHashtag, null];
    } catch(error){
        handleError(error, "hashtag.service -> createHashtag")
    }
}

async function getHashtags(){
    try {
        const hashtags = await Hashtag.find();
        if(!hashtags) return [null, "No se encontraron hashtags en la bbdd"];
        return [hashtags, null];
    } catch (error) {
        handleError(error, "hashtag.service -> getHashtags")
    }
}

async function getHashtagById(id){
    try{
        const hashtag = await Hashtag.findById(id);
        if(!hashtag) return [null, "Hashtag no encontrado"];
        return [hashtag, null];
    } catch(error){
        handleError(error, "hashtag.service -> getHashtag")
    }
}

async function updateHashtag(id, hashtag){
    try{

    }catch(error){
        handleError(error, "hashtag.service -> updateHashtag")
    }
}

async function deleteHashtag(id){
    try{
        const hashtag = await Hashtag.findByIdAndDelete(id);
        if(!hashtag) return [null, "Hashtag no encontrado"];
        return [hashtag, null];
    } catch(error){
        handleError(error, "hashtag.service -> deleteHashtag")
    }
}

module.exports = {
    createHashtag,
    getHashtags,
    getHashtagById,
    updateHashtag,
    deleteHashtag
}