/* <----------------------- SERVICIOS ------------------------> */
const NotificationService = require('../services/notification.service');

/* <----------------------- SCHEMA ------------------------> */
// [NOTA]: Revisar incorporacion de schema de NOTIFICATION
const { userIdSchema } = require("../schema/user.schema.js");

/* <----------------------- FUNCIONES ------------------------> */
// Funciones que manejan las respuestas HTTP exitosas/erroneas.
const { respondSuccess, respondError } = require('../utils/resHandler');
// handleError: Funcion de registro y manejo de errores de manera centralizada
const { handleError } = require('../utils/errorHandler');

/**
 * Crea una nueva notificación utilizando el servicio 'NotificationService.createNotification()' con el parametro de body
 * que contiene los campos necesarios y requeridos de la notificación.
 * @param {Object} req - Objeto de solicitud (request) para crear una nueva notificación a partir de req.body
 * @param {Object} res -  Objeto de respuesta (response) que contiene informacion sobre respuesta HTTP.
 * @returns {Promise<void>} Promesa que no devuelve ningun valor explicito.
 */
async function createNotification(req, res) {
    try {
        const { userId, message } = req.body;
        const notification = { userId, message };
        const [newNotification, notificationError] = await NotificationService.createNotification(notification);
        if (notificationError) return respondError(req, res, 400, notificationError);
        if (!newNotification) return respondError(req, res, 400, 'No se creo la notificación');
        respondSuccess(req, res, 201, newNotification);
    } catch (error) {
        handleError(error, 'notification.controller -> createNotification');
        respondError(req, res, 500, 'No se creo notificación');
    }
}

/**
 * Obtiene todas las notificaciones de un usuario específico utilizando el servicio 'NotificationService.getNotifications()'.
 * @param {Object} req - Objeto de solicitud (request) que contiene el id del usuario en `req.params.userId`.
 * @param {Object} res - Objeto de respuesta (response) que contiene información sobre respuesta HTTP.
 * @returns {Promise<void>} Promesa que no devuelve ningún valor explícito.
 */
async function getNotifications(req, res) {
    try {
        const { userId } = req.params;
        const [notifications, notificationsError] = await NotificationService.getNotifications(userId);
        if (notificationsError) return respondError(req, res, 400, notificationsError);
        if (!notifications) return respondError(req, res, 400, 'No se encontraron notificaciones');
        respondSuccess(req, res, 200, notifications);
    } catch (error) {
        handleError(error, 'notification.controller -> getNotifications');
        respondError(req, res, 500, 'Error al obtener notificaciones');
    }
}

/**
 * Obtiene una notificación por su id utilizando el servicio 'NotificationService.getNotification()'.
 * @param {Object} req - Objeto de solicitud (request) que contiene el id de la notificación en `req.params.id`.
 * @param {Object} res - Objeto de respuesta (response) que contiene información sobre respuesta HTTP.
 * @returns {Promise<void>} Promesa que no devuelve ningún valor explícito.
 */
async function getNotification(req, res) {
    try {
        const { id } = req.params;
        const [notification, notificationError] = await NotificationService.getNotification(id);
        if (notificationError) return respondError(req, res, 400, notificationError);
        if (!notification) return respondError(req, res, 400, 'No se encontró la notificación');
        respondSuccess(req, res, 200, notification);
    } catch (error) {
        handleError(error, 'notification.controller -> getNotification');
        respondError(req, res, 500, 'Error al obtener notificación');
    }
}

/**
 * Actualiza una notificación por su id utilizando el servicio 'NotificationService.updateNotification()'.
 * @param {Object} req - Objeto de solicitud (request) que contiene el id de la notificación en `req.params.id` y los datos a actualizar en `req.body`.
 * @param {Object} res - Objeto de respuesta (response) que contiene información sobre respuesta HTTP.
 * @returns {Promise<void>} Promesa que no devuelve ningún valor explícito.
 */
async function updateNotification(req, res) {
    try {
        const { id } = req.params;
        const notification = req.body;
        const [updatedNotification, updateError] = await NotificationService.updateNotification(id, notification);
        if (updateError) return respondError(req, res, 400, updateError);
        if (!updatedNotification) return respondError(req, res, 400, 'No se actualizó la notificación');
        respondSuccess(req, res, 200, updatedNotification);
    } catch (error) {
        handleError(error, 'notification.controller -> updateNotification');
        respondError(req, res, 500, 'Error al actualizar notificación');
    }
}

/**
 * Elimina una notificación por su id utilizando el servicio 'NotificationService.deleteNotification()'.
 * @param {Object} req - Objeto de solicitud (request) que contiene el id de la notificación en `req.params.id`.
 * @param {Object} res - Objeto de respuesta (response) que contiene información sobre respuesta HTTP.
 * @returns {Promise<void>} Promesa que no devuelve ningún valor explícito.
 */
async function deleteNotification(req, res) {
    try {
        const { id } = req.params;
        const [message, deleteError] = await NotificationService.deleteNotification(id);
        if (deleteError) return respondError(req, res, 400, deleteError);
        if (!message) return respondError(req, res, 400, 'No se eliminó la notificación');
        respondSuccess(req, res, 200, message);
    } catch (error) {
        handleError(error, 'notification.controller -> deleteNotification');
        respondError(req, res, 500, 'Error al eliminar notificación');
    }
}

/**
 * Marca una notificación como leída utilizando el servicio 'NotificationService.markAsRead()'.
 * @param {Object} req - Objeto de solicitud (request) que contiene el id de la notificación en `req.params.id`.
 * @param {Object} res - Objeto de respuesta (response) que contiene información sobre respuesta HTTP.
 * @returns {Promise<void>} Promesa que no devuelve ningún valor explícito.
 */
async function markAsRead(req, res) {
    try {
        const [notification, error] = await NotificationService.markAsRead(req.params.id);
        if (error) {
            respondError(res, error);
        } else {
            respondSuccess(res, notification);
        }
    } catch (error) {
        handleError(error, "notification.controller -> markAsRead");
    }
}

module.exports = {
    createNotification,
    getNotifications,
    getNotification,
    updateNotification,
    deleteNotification,
    markAsRead
};