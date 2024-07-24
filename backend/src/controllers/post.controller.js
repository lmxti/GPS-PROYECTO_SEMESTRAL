/* <----------------------- SERVICIOS ------------------------> */
const PostService = require("../services/post.service.js");

/* <----------------------- SCHEMA ------------------------> */
const { postBodySchema } = require("../schema/post.schema.js");
const { userIdSchema } = require("../schema/user.schema.js");

/* <----------------------- FUNCIONES ------------------------> */
// Funciones que manejan las respuestas HTTP exitosas/erroneas.
const { respondSuccess, respondError } = require("../utils/resHandler.js");
// handleError: Funcion de registro y manejo de errores de manera centralizada 
const { handleError } = require("../utils/errorHandler.js");

/**
 *  Crea una nueva publicacion utilizando el servicio `PostService.createPost()` con el parametro de 
 * body que contiene campos como title, description y author.
 * @param {Object} req -  Objeto de solitiud (request) para crear una nueva publicacion a partir de `req.body`.
 * @param {Object} res -  Objeto de respuesta (response) que contiene informacion sobre respuesta HTTP.
 * @returns {Promise<void>} Promesa que no devuelve ningun valor explicito.
 */
async function createPost(req, res) {
    try {
        const { title, description, author, hashtags} = req.body;
        const { error: bodyError} = postBodySchema.validate(req.body);
        if(bodyError) return respondError(req, res, 400, bodyError.message);
        const post = { title, description, author, hashtags };
        const [newPost, PostError ] = await PostService.createPost(post, req.files);
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
        const { title, description, author, hashtags, status  } = req.body;
        let base64Image = null;
        if (req.file) {
            const imageBuffer = req.file.buffer;
            base64Image = imageBuffer.toString("base64");
        }
        const post = { title, description, author, hashtags, status};
        const [updatedPost, postError] = await PostService.updatePost(id, post);
        if(postError) return respondError(req, res, 400, postError);
        if(!updatedPost) return respondError(req, res, 400, "No se encontro publicacion");
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

//<---------------------------------------------------- CONTROLADORES ESPECIALES ---------------------------------------------------->
/**
 * Agrega o quita reaccion(helful o nothelpful) de usuario a publicacion utilizando el servicio 'PostService.markPostInteraction()'
 * que recibe el id de publicacion como parametro de la solicitud y el id junto a la reaccion que provienen del cuerpo de la solicitud(body)
 * @param {Object} req - EL objeto de la solicitud (request) contiene en su parametro id de publicacion y en el body id y reaccion de usuario.
 * @param {Object} res - Objeto de respuesta (response) que contiene informacion sobre respuesta HTTP.
 * @returns {Promise<void>} Promesa que no devuelve ningun valor explicito.
 */
async function markPostInteraction(req, res){
    try {
        const { postId } = req.params;
        const { id, type } = req.body;
        const { error: errorIdUser} = userIdSchema.validate({id});
        if(errorIdUser) return respondError(req, res, 400, errorIdUser.message);
        const [interaction, interactionError] = await PostService.markPostInteraction(postId, id, type);
        if(interactionError) return respondError(req, res, 400, interactionError);
        if(!interaction) return respondError(req, res, 400, "No existen datos de interaccion");
        respondSuccess(req, res, 200, { message: "Interaccion exitosa", data: interaction});

    } catch (error) {
        handleError(error, "post.controller -> markPostInteraction");
    }
}


async function savePostAsFavorite(req, res){
    try {
        const { postId } = req.params;
        const { userId} = req.body;
        const [savePost, savePostError] = await PostService.savePostAsFavorite(userId, postId);
        if(savePostError) return respondError(req, res, 400,  savePostError);
        if(!savePost) return respondError(req,res, 400, "La publicacion no se agrego a favoritos");
        respondSuccess(req, res, 201, savePost);
    } catch (error) {
        handleError(error, 'post.controller -> savePostAsFavorite');
        respondError(req, res, 500, 'Publicacion no se agrego a favoritos');
        
    }
}

async function getUserFavoritePosts(req, res){
    try {
        const {userId} = req.params;
        const [posts, errorPosts] = await PostService.getUserFavoritePosts(userId);
        if(errorPosts) return respondError(req, res, 400,  errorPosts);
        if(!posts) return respondError(req,res, 400, "No se encontro favoritos");
        respondSuccess(req, res, 200, posts);
    } catch (error) {
        handleError(error, 'post.controller -> getUserFavoritePosts');
        respondError(req, res, 500, 'No se encontro  favoritos');
    }
}

async function getSharedAndSavedPosts(req, res){
    try {
        const {userId} = req.params;
        const [sharedSaved, errorSharedSaved] = await PostService.getSharedAndSavedPosts(userId);
        if(errorSharedSaved) return respondError(req, res, 400, errorSharedSaved);
        if(!sharedSaved) return respondError(req,res, 400, "No se encontro compartidos/favoritos");
        respondSuccess(req, res, 200, sharedSaved);
    } catch (error) {
        handleError(error, 'post.controller -> getSharedAndSavedPosts');
        respondError(req, res, 500, 'No se encontro compartidos ni guardados');
    }
}

async function sharePost(req, res){
    try {
        const { postId } = req.params;
        const { userId} = req.body;
        console.log(postId, userId);
        const [sharePost, sharePostError] = await PostService.sharePost(userId, postId);
        if(sharePostError) return respondError(req, res, 400,  sharePostError);
        if(!sharePost) return respondError(req,res, 400, "La publicacion no se compartio");
        respondSuccess(req, res, 201, sharePost);
    } catch (error) {
        handleError(error, 'post.controller -> sharePost');
        respondError(req, res, 500, 'No se encontro compartidos');
    }
}

async function getSharedPosts(req, res){
    try {
        const {userId} = req.params;
        const [posts, errorPosts] = await PostService.getSharedPosts(userId);
        if(errorPosts) return respondError(req, res, 400,  errorPosts);
        if(!posts) return respondError(req,res, 400, "No se encontro compartidos");
        respondSuccess(req, res, 200, posts);
    } catch (error) {
        handleError(error, 'post.controller -> getSharedPosts');
        respondError(req, res, 500, 'No se encontro compartidos');
    }
}

async function getPostsFollowed(req, res){
    try {
        const { userId } = req.params;
        const [posts, errorPosts] = await PostService.getPostsFollowed(userId);
        if(errorPosts) return respondError(req, res, 400,  errorPosts);
        if(!posts) return respondError(req,res, 400, "No se encontraron publicaciones para usuario");
        respondSuccess(req, res, 200, posts);
    } catch (error) {
        handleError(error, 'post.controller -> getPostsFollowed');
        respondError(req, res, 500, 'No se encontraron publicaciones para el usuario');
    }
}

async function getPostsByHashtag(req, res){
    try {
        const { hashtagId } = req.params;
        const [posts, errorPosts] = await PostService.getPostsByHashtag( hashtagId );
        if(errorPosts) return respondError(req, res, 400,  errorPosts);
        if(!posts) return respondError(req,res, 400, "No se encontraron publicaciones con el hashtag");
        respondSuccess(req, res, 200, posts);
    } catch (error) {
        handleError(error, 'post.controller -> getPostByHashtag');
        respondError(req, res, 500, 'No se encontraron publicaciones de hashtag');
    }
}

module.exports = {
    createPost,
    getPosts,
    getPostByID,
    getUserPosts,
    updatePost,
    deletePost,
    // Controladores especiales
    markPostInteraction,
    savePostAsFavorite,
    getUserFavoritePosts,
    getSharedAndSavedPosts,
    sharePost,
    getSharedPosts,
    getPostsFollowed,
    getPostsByHashtag
}