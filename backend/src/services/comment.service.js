/* <----------------------- MODELOS --------------------------> */
const User = require("../models/user.model");
const Post = require("../models/post.model.js");
const Comment = require("../models/comment.model");

/* <----------------------- FUNCIONES ------------------------> */
// handleError: Funcion de registro y manejo de errores de manera centralizada 
const { handleError } = require("../utils/errorHandler.js")

/**
 * Servicio para crear un comentario e incorporarlo a publicacion, recibe el id de publicacion para revisar
 * si admite comentarios basado en el 'status' del post.
 * @param {Object} bodyComment - Objeto que contiene datos de comentario a crear.
 * @param {string} bodyComment.userComment - Comentario textual de usuario.
 * @param {string} bodyComment.imageComment - Imagen de comentario (opcional).
 * @param {string} bodyComment.fileComment - Archivo de comentario (opcional).
 * @param {string} bodyComment.userId - Id de usuario que realiza comentario.
 * @param {string} bodyComment.postId - Id de publicacion que se comenta.
 * @returns {Promise<Array>} Promesa que resuelve a un arreglo que contiene `[newComment, null] si tiene éxito o `[null, mensaje de error]` si falla.
 */
async function createComment(bodyComment){
    try{
        const { userComment, ImageComment, fileComment, userId, postId } = bodyComment;
        const userFound = await User.findById(userId);
        if(!userFound) return [ null, "Usuario no encontrado"];
        const postFound = await Post.findById(postId);
        if (!postFound) return [ null, "Publicacion no encontrada"];
        if(!postFound.status) return [null, "La publicacion esta cerrada y no permite comentarios."];
        const newComment = new Comment({ userComment, ImageComment, fileComment, userId, postId });
        await newComment.save();
        postFound.comments.push(newComment._id);
        await postFound.save();
        return [newComment, null];
    }
    catch(error){
        handleError(error, "comment.service -> createComment")
    }
}

async function getComments(){
    try {
        const comments = await Comment.find()
        .populate("user")
        .exec();
        if(!comments) return [null, "No se encontraron comentarios en la bbdd"]
        return [comments, null];
    } catch (error) {
        handleError(error, "comment.service -> getComments")
    }
}

async function getComment(id){
    try {
        const comment = await Comment.findById(id)
        .populate("user")
        .exec();
        if(!comment) return [null, "Comentario no encontrado"]
        return [comment, null];
    } catch (error) {
        handleError(error, "comment.service -> getComment")
    }
}

async function updateComment(id, comment){
    try {
        const {
            userComment,
            ImageComment,
            fileComment,
            user
        } = comment;
        const commentFound = await Comment.findById(id);
        if(!commentFound) return [null, "Comentario no encontrado"];
        const userFound = await User.findById(user);
        if(!userFound) return [null, "Usuario no encontrado"];
        commentFound.userComment = userComment;
        commentFound.ImageComment = ImageComment;
        commentFound.fileComment = fileComment;
        commentFound.user = user;
        await commentFound.save();
        return [commentFound, null];
    } catch (error) {
        handleError(error, "comment.service -> updateComment")
    }
}

async function deleteComment(id){
    try {
        const commentFound = await Comment.findById(id);
        if(!commentFound) return [null, "Comentario no encontrado"];
        await commentFound.remove();
        return [commentFound, null];
    } catch (error) {
        handleError(error, "comment.service -> deleteComment")
    }
}


async function getCommentsByUser(userId){
    try {
        const comments = await Comment.find({ user: userId })
        .populate("user")
        .exec();
        if(!comments) return [null, "No se encontraron comentarios en la bbdd"]
        return [comments, null];
    } catch (error) {
        handleError(error, "comment.service -> getCommentsByUser")
    }
}

async function editComment(commentId, comment){
    try {
        const {
            userComment,
            ImageComment,
            fileComment,
            user
        } = comment;
        const commentFound = await Comment.findById(commentId);
        if(!commentFound) return [null, "Comentario no encontrado"];
        const userFound = await User.findById(user);
        if(!userFound) return [null, "Usuario no encontrado"];
        commentFound.userComment = userComment;
        commentFound.ImageComment = ImageComment;
        commentFound.fileComment = fileComment;
        commentFound.user = user;
        await commentFound.save();
        return [commentFound, null];
    } catch (error) {
        handleError(error, "comment.service -> editComment")
    }
}

module.exports = {
    createComment,
    getComments,
    getComment,
    updateComment,
    deleteComment,
    getCommentsByUser,
    editComment
}