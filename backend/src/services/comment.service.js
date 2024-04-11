const Comment = require("../models/comment.model");
const User = require("../models/user.model");
const { handleError } = require("../utils/errorHandler.js");

/** --------- CREATE ------------------
 * Crea un nuevo comentario en la base de datos
 * @param {Object} "comment" es un objeto de comentario con sus datos
 * @returns {Promise} Promesa con el objeto de comentario creado.
 */

async function createComment(comment){
    try{
        const {
            userComment,
            ImageComment,
            fileComment,
            user
        } = comment;
        const userFound = await User.findById(user);
        if(!userFound) return [ null, "Usuario no encontrado"];
        const newComment = new Comment({
            userComment,
            ImageComment,
            fileComment,
            user
        });
        await newComment.save();
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