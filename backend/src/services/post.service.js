/* <----------------------- MODELOS --------------------------> */
const Post = require("../models/post.model");
const User = require("../models/user.model");

/* <----------------------- FUNCIONES ------------------------> */
// handleError: Funcion de registro y manejo de errores de manera centralizada 
const { handleError } = require("../utils/errorHandler.js")

/**
 * Servicio para crear una publicacion utilizando datos proporcionados
 * @param {Object} post - Objeto que contiene datos de publicacion a crear
 * @param {string} post.title - Título de la publicación.
 * @param {string} post.description - Descripción de la publicación.
 * @param {Array} post.images - Arreglo de imágenes asociadas a la publicación.
 * @param {string} post.author - ID del autor de la publicación.
 * @param {Array} post.hashtags - Arreglo de hashtags asociados a la publicación.
 * @returns {Promise<Array>} Promesa que resuelve a un arreglo que contiene `[newPost, null] si tiene éxito o `[null, mensaje de error]` si falla.
 */
async function createPost(post) {
    try {
        const { title, description, images, author, hashtags } = post;
        const userExists = await User.findOne({ _id: author })
        if(!userExists) return [null, "El autor de publicacion no existe"];
        const newPost = new Post({
            title,
            description,
            images,
            author,
            hashtags
        })
        await newPost.save();
        return [newPost, null]
    } catch (error) {
        handleError(error, "post.service -> createPost");
    }
}
/**
 * Servicio para obtener todas las publicaciones existentes
 * @returns {Promise<Array>} Promesa que resuelve a un arreglo que contiene `[posts, null] si tiene éxito o `[null, mensaje de error]` si falla.
 */
async function getPosts() {
    try{
        const posts = await Post.find()
        if(!posts) return [null, "No se encontraron publicaciones"];
        return[posts, null];
    }catch(error){
        handleError(error, "post.service -> getPosts");
    }
}
/**
 * Servicio de busqueda y obtencion de publicacion existente por su id
 * @param {string} id - id del usuario a obtener publicaciones.
 * @returns {Promise<Array>} Promesa que resuelve a un arreglo que contiene `[post, null] si tiene éxito o `[null, mensaje de error]` si falla.
 */
async function getPostByID(id) {
    try {
        const post = await Post.findById({ _id: id});
        if(!post) return [null, `No se encontro la publicacion de id: ${id}`];
        return [post, null]
    } catch (error) {
        handleError(error, "post.service -> getPostByID");
    }
}

/**
 * Servicio de busqueda y obtencion de todas las publicaciones de un usuario especifico
 * @param {string} id id del usuario del cual se obtendran publicaciones
 * @returns {Promise<Array>} Promesa que resuelve un arreglo que contiene `[posts, null] si tiene éxito o `[null, mensaje de error]` si falla.
 */
async function getUserPosts(id){
    try {
        const user = await User.findById({ _id: id })
            .select("-password")
            .populate("roleUser")
            .exec();
        if(!user) return [ null, "No se encontro usuario"]
        const posts = await Post.find({ author: user._id});
        return [ posts, null]
    } catch (error) {
        handleError(error, "post.service -> getUserPosts")
    }
}

/**
 * Servicio para actualizar los campos de una publicación existente.
 * @param {string} id - ID de la publicación a actualizar.
 * @param {Object} body - Objeto que contiene los campos a actualizar.
 * @param {string} body.title - Nuevo título de la publicación.
 * @param {string} body.description - Nueva descripción de la publicación.
 * @param {Array} body.hashtags - Nuevo arreglo de hashtags asociados a la publicación.
 * @returns {Promise<Array>} Promesa que resuelve un arreglo que contiene `[postUpdated, null] si tiene éxito o `[null, mensaje de error]` si falla.
 */
async function updatePost(id, body) {
    try {
        const post = await Post.findById(id);
        if(!post) return [null, `No se encontro la publicacion de id: ${id}`];
        const { title, description, hashtags } = body;
        const postUpdated = await Post.findByIdAndUpdate(
            id,
            { title, description, hashtags },
            { new: true }
        );
        return [postUpdated, null];
    } catch (error) {
        handleError(error, "post.service -> updatePost");
    }
}
/**
 * Servicio para eliminar una publicación existente por su ID.
 * @param {string} id - id de la publicación a eliminar.
 * @returns {Promise<Array>} Promesa que resuelve un arreglo que contiene `[postDeleted, null] si tiene éxito o `[null, mensaje de error]` si falla.
 */
async function deletePost(id){
    try {
        const postDeleted = await Post.findByIdAndDelete(id);
        if(!postDeleted) return [null, `No se encontro publicacion de id: ${id}`];
        return [postDeleted, null];
    } catch (error) {
        handleError(error, "post.service -> deletePost");
    }
}


module.exports = {
    createPost,
    getPosts,
    getPostByID,
    getUserPosts,
    updatePost,
    deletePost
}