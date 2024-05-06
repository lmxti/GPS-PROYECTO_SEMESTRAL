/* <----------------------- SERVICIOS ------------------------> */
const CommentService = require('../services/comment.service');

/* <----------------------- SCHEMA ------------------------> */
// [NOTA]: Revisar incorporacion de schema de COMMENT
const { userIdSchema } = require("../schema/user.schema.js");

/* <----------------------- FUNCIONES ------------------------> */
// Funciones que manejan las respuestas HTTP exitosas/erroneas.
const { respondSuccess, respondError } = require('../utils/resHandler');
// handleError: Funcion de registro y manejo de errores de manera centralizada 
const { handleError } = require('../utils/errorHandler');


/**
 * Crea un nuevo comentario utilizando el servicio 'CommentService.createComment()' con el parametro de body
 * que contiene los campos necesarios y requeridos del comentario.
 * @param {Object} req - Objeto de solicitud (request) para crear un nuevo comentario a partir de req.body
 * @param {Object} res -  Objeto de respuesta (response) que contiene informacion sobre respuesta HTTP.
 * @returns {Promise<void>} Promesa que no devuelve ningun valor explicito.
 */
async function createComment(req, res) {
    try {
        const { body } = req;
        //[NOTA] commentSchema...?
        const [newComment, commentError] = await CommentService.createComment(body);
        if (commentError) return respondError(req, res, 400, commentError);
        if (!newComment) return respondError(req, res, 400, 'No se creo el comentario');
        respondSuccess(req, res, 201, newComment);
    } catch (error) {
        handleError(error, 'comment.controller -> createComment');
        respondError(req, res, 500, 'No se creo comentario');
    }
}
/**
 * Busca y obtiene todos los comentarios creados utilizando el servicio 'CommentService.getComments()'.
 * @param {Object} req - El objeto de solicitud (request) no se utiliza en esta funcion.
 * @param {Object} res - Objeto de respuesta (response) que contiene informacion sobre respuesta HTTP.
 * @returns {Promise<void>} Promesa que no devuelve ningun valor explicito.
 */
async function getComments(req, res) {
    try {
        const [comments, errorComments] = await CommentService.getComments();
        if (errorComments) return respondError(res, 500, 'Error al buscar comentarios');
        comments.length === 0
            ? respondSuccess(req, res, 200, 'No existen comentarios en la bbdd')
            : respondSuccess(req, res, 200, { message: 'Se encontraron los siguientes comentarios: ', data: comments });
    } catch (error) {
        handleError(error, 'comment.controller -> getComments');
        respondError(req, res, 500, 'No se pudo encontrar comentarios');
    }
}

async function getComment(req, res) {
    try {
        const { params } = req;
        const [comment, commentError] = await CommentService.getComment(params.id);
        if (commentError) return respondError(req, res, 404, commentError);
        respondSuccess(req, res, 200, comment);
    } catch (error) {
        handleError(error, 'comment.controller -> getComment');
        respondError(req, res, 500, 'No se pudo encontrar comentario');
    }
}

async function updateComment(req, res) {
    try {
        const { id } = req.params;
        const { body } = req;
        const [comment, commentError] = await CommentService.updateComment(id, body);
        if (commentError) return respondError(req, res, 400, commentError);
        if (!comment) return respondError(req, res, 400, 'No se encontro comentario asociado al id ingresado');
        respondSuccess(req, res, 200, { message: 'Comentario actualizado', data: comment });
    } catch (error) {
        handleError(error, 'comment.controller -> updateComment');
        respondError(req, res, 500, 'No se pudo actualizar comentario');
    }
}

async function deleteComment(req, res) {
    try {
        const { id } = req.params;
        const [comment, commentError] = await CommentService.deleteComment(id);
        if (commentError) return respondError(req, res, 400, commentError);
        if (!comment) return respondError(req, res, 400, 'No se encontro comentario asociado al id ingresado');
        respondSuccess(req, res, 200, { message: 'Comentario eliminado', data: comment });
    } catch (error) {
        handleError(error, 'comment.controller -> deleteComment');
        respondError(req, res, 500, 'No se pudo eliminar comentario');
    }
}


async function getCommentsByUser(req, res) {
    try {
        const { params } = req;
        const [comments, errorComments] = await CommentService.getCommentsByUser(params.id);
        if (errorComments) return respondError(res, 500, 'Error al buscar comentarios');
        comments.length === 0
            ? respondSuccess(req, res, 200, 'No existen comentarios en la bbdd')
            : respondSuccess(req, res, 200, { message: 'Se encontraron los siguientes comentarios: ', data: comments });
    } catch (error) {
        handleError(error, 'comment.controller -> getCommentsByUser');
        respondError(req, res, 500, 'No se pudo encontrar comentarios');
    }
}   


async function editComment(req, res) {
    try {
        const { id } = req.params;
        const { body } = req;
        const [comment, commentError] = await CommentService.editComment(id, body);
        if (commentError) return respondError(req, res, 400, commentError);
        if (!comment) return respondError(req, res, 400, 'No se encontro comentario asociado al id ingresado');
        respondSuccess(req, res, 200, { message: 'Comentario actualizado', data: comment });
    } catch (error) {
        handleError(error, 'comment.controller -> editComment');
        respondError(req, res, 500, 'No se pudo actualizar comentario');
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
};
