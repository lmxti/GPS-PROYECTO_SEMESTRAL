/* <----------------------- SERVICIOS ------------------------> */
const PostService = require("../services/post.service.js");

/* <----------------------- SCHEMA ------------------------> */
const { postBodySchema } = require("../schema/post.schema.js");

/* <----------------------- FUNCIONES ------------------------> */
// Funciones que manejan las respuestas HTTP exitosas/erroneas.
const { respondSuccess, respondError } = require("../utils/resHandler.js");
// handleError: Funcion de registro y manejo de errores de manera centralizada 
const { handleError } = require("../utils/errorHandler.js");

/**
 *  Crea una nueva publicacion utilizando el servicio `PostService.createPost()` con el parametro de 
 * body que contiene campos como title, description y author.
 * @param {Object} req -  Objeto de solitiud (request) para crear una nueva publicacion en `req.body`.
 * @param {Object} res -  Objeto de respuesta (response) que contiene informacion sobre respuesta HTTP.
 * @returns {Promise<void>} Promesa que no devuelve ningun valor explicito.
 */
async function createPost(req, res) {
    try {
        const { body } = req;
        const { error: bodyError} = postBodySchema.validate(body);
        if(bodyError) return respondError(req, res, 400, bodyError.message);
        const [newPost, PostError ] = await PostService.createPost(body);
        console.log("esto es newPost", newPost);
        if(PostError) return respondError(req, res, 400, PostError);
        if(!newPost) return respondError(req, res, 400, "No existen datos newPost");
        respondSuccess(req, res, 201, { message: "Publicacion creada", data: newPost});
    } catch (error) {
        handleError(error, "post.controller -> createPost");
        respondError(req, res, 500, "No se creo publicación");
    }
}

/**
 * Obtiene todas las publicaciones existentes utilizando el servicio `PostService.getPosts()`.
 * @param {Object} req - El objeto de solicitud (request) no se utiliza en esta funcion.
 * @param {Object} res - Objeto de respuesta (response) que contiene informacion sobre respuesta HTTP.
 * @returns {Promise<void>} Promesa que no devuelve ningun valor explicito.
 */
async function getPosts(req, res){
    try {
        const [posts, errorPosts] = await PostService.getPosts();
        if(errorPosts) return [null, "post.controller->errorPosts-> Error al buscar publicaciones"];
        posts.length === 0
            ? respondSuccess(req, res, 200, "No hay publicacione existententes")
            : respondSuccess(req, res, 200, { message: "Se encontraron las siguientes publicaciones", data: posts});
    } catch (error) {
        handleError(error, "post.controller -> getPosts");
        respondError(req, res, 500, "post.controller-> Error de busqueda de publicaciones");
    }
}

/**
 * Busca y obtiene una publicacion existente utilizando el servicio `PostService.getPostByID()`
 * utilizando el id de la publicacion.
 * @param {Object} req - El objeto de solicitud (request) contiene el id de publicacion en `req.params`.
 * @param {Object} res - Objeto de respuesta (response) que contiene informacion sobre respuesta HTTP.
 * @returns {Promise<void>} Promesa que no devuelve ningun valor explicito.
 */
async function getPostByID(req, res) {
    try {
        const { id } = req.params;
        const [post, errorPost] = await PostService.getPostByID(id);
        if(errorPost) return respondError(req, res, 400, errorPost);
        if(!post) return respondError(req, res, 400, "post.controller->errorPost-> No se encontro post");
        respondSuccess(req, res, 200, { message: "Publicacion encontrada", data: post});
    } catch (error) {
        handleError(error, "post.controller -> getPostByID");
        respondError(req, res, 500, "post.controller-> Error de busqueda de publicacion");
    }
}
/**
 * Busca y obtiene todas las publicaciones de un usuario especifico utilizando el servicio `PostService.getUserPosts()`
 * utilizando el id del usuario a buscar sus publicaciones.
 * @param {Object} req - El objeto de solicitud (request) contiene el id de persona en `req.params`.
 * @param {Object} res - Objeto de respuesta (response) que contiene informacion sobre respuesta HTTP.
 * @returns {Promise<void>} Promesa que no devuelve ningun valor explicito.
 */
async function getUserPosts(req, res){
    try {
        const { id } = req.params;
        const [posts, errorPosts] = await PostService.getUserPosts(id);
        if(errorPosts) return respondError(req, res, 400, errorPosts);
        posts.length === 0
            ? respondSuccess(req, res, 200, "No hay publicacione existententes")
            : respondSuccess(req, res, 200, { message: "Se encontraron las siguientes publicaciones", data: posts});
    } catch (error) {
        handleError(error, "post.controller -> getUserPosts");
        respondError(req, res, 500, `post.controller-> Error de busqueda de publicaciones de usuario`);
    }
}

/**
 *  Busca y actualiza los campos de una publicacion existente utilizando el servicio `PostService.updatePost()`
 * que utiliza el id de la publicacion a editar y el body que contiene las modificaciones.
 * @param {Object} req - El objeto de solicitud (request) contiene el id en `req.params` y las modificaciones en el body de la solicitud
 * @param {Object} res - Objeto de respuesta (response) que contiene informacion sobre respuesta HTTP
 * @returns {Promise<void>} Promesa que no devuelve ningun valor explicito
 */
async function updatePost(req, res){
    try {
        const { id } = req.params;
        const { body } = req;
        const [post, postError] = await PostService.updatePost(id, body);
        if(postError) return respondError(req, res, 400, postError);
        if(!post) return respondError(req, res, 400, "No se encontro publicacion");
        respondSuccess(req, res, 200, { message: "Publicacion actualizada", data: post});
    } catch (error) {
        handleError(error, "post.controller -> updatePost");
        respondError(req, res, 500, "post.controller-> Error al actualizar publicacion");
    }
}

/**
 * Busca y elimina una publicacion existente utilizando el servicio `PostService.deletePost()` que utiliza el id
 * de la publicacion a eliminar.
 * @param {Object} req - EL objeto de la solicitud (request) contiene el id de publicacion en `req.params`.
 * @param {Object} res - Objeto de respuesta (response) que contiene informacion sobre respuesta HTTP.
 * @returns {Promise<void>} Promesa que no devuelve ningun valor explicito.
 */
async function deletePost(req, res) {
    try {
        const { id } = req.params;
        const post = await PostService.deletePost(id);
        !post
            ? respondError(req, res, 400, "No se elimino publicacion")
            : respondSuccess(req, res, 200, { message: "Publicacion eliminada con exito", data: post});
    } catch (error) {
        handleError(error, "post.controller -> deletePost");
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