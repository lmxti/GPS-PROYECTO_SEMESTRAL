const CommentService = require('../services/comment.service');
const { respondSuccess, respondError } = require('../utils/resHandler');
const { handleError } = require('../utils/errorHandler');


async function createComment(req, res) {
    try {
        const { body } = req;
        const [newComment, commentError] = await CommentService.createComment(body);
        if (commentError) return respondError(req, res, 400, commentError);
        if (!newComment) return respondError(req, res, 400, 'No se creo el comentario');
        respondSuccess(req, res, 201, newComment);
    } catch (error) {
        handleError(error, 'comment.controller -> createComment');
        respondError(req, res, 500, 'No se creo comentario');
    }
}

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
