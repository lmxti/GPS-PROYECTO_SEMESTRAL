/* <----------------------- MODELOS --------------------------> */
const Post = require("../models/post.model");
const User = require("../models/user.model");
const Hashtag = require("../models/hashtag.model.js");

/* <----------------------- FUNCIONES ------------------------> */
// handleError: Funcion de registro y manejo de errores de manera centralizada 
const { handleError } = require("../utils/errorHandler.js");

/* <----------------------- UTILS ------------------------> */
const { saveImagePost, saveHashtagsPost } = require("../utils/generalUtils.js");

/* <----------------------- TRIGGERS ------------------------> */
const { checkAchievementsPost } = require("../triggers/achievements.trigger.js");

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
async function createPost(post, files = []) {
    try {
        const { title, description, author, hashtags } = post;
        const userExists = await User.findOne({ _id: author })
        if(!userExists) return [null, "Id de usuario a crear publicacion no existe, verifica id."];

        const fileNames = await Promise.all(
            files.map( file => saveImagePost(file) )
        );
        const hashtagsIDs = await saveHashtagsPost(hashtags);

        const newPost = new Post({ title, description, images:fileNames, author, hashtags: hashtagsIDs })
        await newPost.save();

        userExists.posts.push(newPost._id);
        await userExists.save();

        checkAchievementsPost(author);

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
    try {
        const posts = await Post.find()
            .populate({
                path: 'author',
                select: '_id name'
            })
            .populate({
                path: 'hashtags',
                select: '_id nameHashtag'
            })
        if (!posts) {
            return [null, "No se encontraron publicaciones"];
        }

        const publicationData = posts.map(post => ({
            ...post.toObject(),
            images: post.images.map(imageName => `http://localhost:3001/uploads/images/${imageName}`),
        }));

        return [publicationData, null];

    } catch (error) {
        handleError(error, "post.service -> getPosts");
        return [null, error.message];
    }
}
/**
 * Servicio de busqueda y obtencion de publicacion existente por su id
 * @param {string} id - id del usuario a obtener publicaciones.
 * @returns {Promise<Array>} Promesa que resuelve a un arreglo que contiene `[post, null] si tiene éxito o `[null, mensaje de error]` si falla.
 */
async function getPostByID(id) {
    try {
        // Busqueda de publicacion de usuario por `id`
        const post = await Post.findById({ _id: id})
            .populate('hashtags')
            .populate({
                path: "author",
                select: '_id name'
            })
        if(!post) return [null, `No se encontro la publicacion de id: ${id}`];


        const publicationData = {
            ...post.toObject(),
            images: post.images.map(imageName => `http://localhost:3001/uploads/images/${imageName}`),
        };

        return [publicationData, null]
    } catch (error) {
        handleError(error, "post.service -> getPostByID");
    }
}
/**
 * Servicio de busqueda y obtencion de todas las publicaciones de un usuario especifico
 * @param {string} id id del usuario del cual se obtendran publicaciones
 * @returns {Promise<Array>} Promesa que resuelve un arreglo que contiene `[posts, null] si tiene éxito o `[null, mensaje de error]` si falla.
 */
async function getUserPosts(id) {
    try {
        const user = await User.findById(id)
            .select("-password")
            .populate("roleUser")
            .exec()

        if (!user) return [null, "No se encontró usuario"];

        const posts = await Post.find({ author: user._id })
            .populate({ path: "author", select: "_id name" })
            .populate({ path: "hashtags", select: "_id nameHashtag" })
            .exec();

        if (!posts.length) return [null, "No se encontraron publicaciones"];

        const publicationData = posts.map(post => ({
            ...post.toObject(),
            images: post.images.map(imageName => `http://localhost:3001/uploads/images/${imageName}`),
        }));

        return [publicationData, null];

    } catch (error) {
        handleError(error, "post.service -> getUserPosts");
        return [null, "Error al obtener publicaciones del usuario"];
    }
}

/**
 * Servicio para actualizar los campos de una publicación existente.
 * @param {string} id - ID de la publicación a actualizar.
 * @param {Object} body - Objeto que contiene los campos a actualizar.
 * @returns {Promise<Array>} Promesa que resuelve un arreglo que contiene `[postUpdated, null] si tiene éxito o `[null, mensaje de error]` si falla.
 */
async function updatePost(id, body) {
    try {
        const post = await Post.findById(id);
        if(!post) return [null, `No se encontro la publicacion de id: ${id}`];
        const { title, description, hashtags, status } = body;
        const postUpdated = await Post.findByIdAndUpdate(
            id,
            { title, description, hashtags, status },
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
        await User.updateOne(
            { _id: postDeleted.author },
            { $pull: { posts: id } }
        );
        return [postDeleted, null];
    } catch (error) {
        handleError(error, "post.service -> deletePost");
    }
}
/**
 * 
 * @param {string} postId - El id de publicacion.
 * @param {string} userId - El id de usuario que interactua con la publicacion.
 * @param {string} interactionType - El tipo de interacción ("helpful" o "nothelpful").
 * @returns {Promise<Array>} Promesa que resuelve un arreglo que contiene la publicacion y la interaccion actualizada si tiene exito,si falla retorna `[null, mensaje de error]`
 */
async function markPostInteraction(postId, userId, interactionType){
    try {
        const postExist = await Post.findById(postId);
        if(!postExist) return [null, `No se encontro publicacion de id: ${postId}`];
        const userExist = await User.findById(userId);
        if(!userExist) return [null, `No se encontro usuario de id: ${userId}`];
        if (interactionType !== "helpful" && interactionType !== "nothelpful") return [null, "El tipo de interacción debe ser 'helpful' o 'nothelpful'"]

        // Busqueda de interacciones previas de usuario con la publicacion
        const userInteractionIndex = postExist.interactions.findIndex( interaction =>interaction.user.toString() === userId)
        // Si el usuario ya ha interactuado antes con la publicacion
        if(userInteractionIndex !== -1){
            // Si la interaccion nueva es igual a la previa, se elimina
            if(postExist.interactions[userInteractionIndex].type === interactionType){
                postExist.interactions.splice(userInteractionIndex, 1);
            } else{
                // Si la interaccion nueva es distinta a la previa, se actualiza por la nueva.
                postExist.interactions[userInteractionIndex].type = interactionType;
            }
        }
        else{
            postExist.interactions.push({user: userId, type: interactionType});
        }
        await postExist.save();
        return [postExist, null]
    } catch (error) {
        handleError(error, "post.service -> markPostInteraction")
    }
}

//<---------------------------------------------------- SERVICIOS ESPECIALES ---------------------------------------------------->
/**
 * @description Funcion que permite guardar publicaciones (privadas)
 * @param {string} userId - Numero de identificacion de usuario
 * @param {string} postId - Numero de identificacion de publicacion a guardar.
 * @returns 
 */
async function savePostAsFavorite(userId, postId){
    try {
        const userFound = await User.findById(userId);
        if(!userFound) return [null, 'Usuario no encontrado'];
        
        const postFound = await Post.findById(postId);
        if(!postFound) return [null, 'Publicacion no encontrada'];

        // Verificar si el post ya está guardado como favorito por el usuario
        const isSaved = userFound.savedPosts.includes(postId);

        if (isSaved) {
            // Si ya está guardado, quitarlo de los favoritos
            console.log("Ya la tenia guardado, se quito de favoritos");
            userFound.savedPosts = userFound.savedPosts.filter(savedPost => savedPost.toString() !== postId);
        } else {
            // Si no está guardado, añadirlo a los favoritos
            console.log("No lo tenia guardado, se agrego a favoritos");
            userFound.savedPosts.push(postFound.id);
        }
        await userFound.save();
        return [userFound, null];

    } catch (error) {
        handleError(error, "post.service -> savePostAsFavorite");
        return [null, error.message];
    }
}
/**
 * @description Funcion que obtiene las publicaciones favoritas de usuario
 * @param {string} userId - Numero de identificacion de usuario 
 */
async function getUserFavoritePosts(userId){
    try {
        const user = await User.findById(userId).populate({
            path: 'savedPosts',
            populate: [{
                path: 'author',
                select: '_id name'
            },{
                path: 'hashtags',
                select: '_id nameHashtag'
            }]
        });
        if (!user) return [null, `No se encontró el usuario con id: ${userId}`];

        const favoritePosts = user.savedPosts.map(post => ({
            ...post.toObject(),
            images: post.images.map(imageName => `http://localhost:3001/uploads/images/${imageName}`)
        }));

        return [favoritePosts, null];
    } catch (error) {
        handleError(error, "post.service -> getUserFavoritePosts");
        return [null, error.message];
    }
}
/**
 * @description Funcion que obtiene las id de las publicaciones que ha compartido/guardado.
 * @param {string} userId - Numero de identificacion de usuario 
 * @returns 
 */
async function getSharedAndSavedPosts(userId){
    try {
        const sharedSaved = await User.findById(userId).select(`savedPosts sharedPosts`);
        if(!sharedSaved) return [null, `No se encontraron compartidos ni guardados`];
        return [sharedSaved, null];
    } catch (error) {
        handleError(error, "post.service -> getSharedAndSavedPosts");
        return [null, error.message];
    }
}

async function sharePost(userId, postId){
    try {
        const userFound = await User.findById(userId);
        if(!userFound)  return [null, "Usuario no encontrado"];
        const postFound = await Post.findById(postId);
        if(!postFound) return [null, "Publicacion no encontrada"];

        // Verificacion si la publicacion ya ha sido compartida.
        const isShared = userFound.sharedPosts.includes(postId);

        if (isShared) {
            // Si ya esta compartida, quitarla
            console.log("Ya la habia compartido, se quito de compartidos");
            userFound.sharedPosts = userFound.sharedPosts.filter(sharedPost => sharedPost.toString() !== postId);
        } else {
            console.log("No la tenia compartida, se compartio ahora");
            userFound.sharedPosts.push(postFound.id)
        }
        await userFound.save();
        return [userFound, null];

    } catch (error) {
        handleError(error, "post.service -> sharePost");
        return [null, error.message];
    }
}

async function getSharedPosts(userId){
    try {
        const user = await User.findById(userId).populate({
            path: 'sharedPosts',
            populate: [{
                path: 'author',
                select: '_id name'
            },{
                path: 'hashtags',
                select: '_id nameHashtag'
            }]
        });
        if (!user) return [null, `No se encontró el usuario con id: ${userId}`];

        const sharedPosts = user.sharedPosts.map(post => ({
            ...post.toObject(),
            images: post.images.map(imageName => `http://localhost:3001/uploads/images/${imageName}`)
        }));

        return [sharedPosts, null];
    } catch (error) {
        handleError(error, "post.service -> getUserFavoritePosts");
        return [null, error.message];
    }
}

async function getPostsFollowed( userId ){
    try {
        const userFound = await User.findById(userId)
        .select('followed followedHashtags')
        .exec();
        const posts = await Post.find({
            $or: [ 
                { author: {$in: userFound.followed}},
                { hashtags: {$in: userFound.followedHashtags}}
            ]
        }).populate({ path: "author", select: "_id name" })
        .populate({ path: "hashtags", select: "_id nameHashtag" })
        .exec();
        if(!posts) return [null, "No se encontraron posts de personas/hashtags seguidos por usuario"];
        
        const publicationData = posts.map(post => ({
            ...post.toObject(),
            images: post.images.map(imageName => `http://localhost:3001/uploads/images/${imageName}`),
        }));
        return [publicationData , null]
    } catch (error) {
        console.log("Error en service", error);
    }
}

module.exports = {
    createPost,
    getPosts,
    getPostByID,
    getUserPosts,
    updatePost,
    deletePost,
    markPostInteraction,
    // Servicios especiales
    savePostAsFavorite,
    getUserFavoritePosts,
    getSharedAndSavedPosts,
    sharePost,
    getSharedPosts,
    getPostsFollowed
}