/* <----------------------- SERVICIOS ------------------------> */
const BadgeService = require('../services/badge.service');

/* <----------------------- SCHEMA ------------------------> */
const { badgeBodySchema } = require('../schema/badge.schema');

/* <----------------------- FUNCIONES ------------------------> */
// Funciones que manejan las respuestas HTTP exitosas/erroneas.
const { respondSuccess, respondError } = require('../utils/resHandler');
// handleError: Funcion de registro y manejo de errores de manera centralizada
const { handleError } = require('../utils/errorHandler');

/**
 * Crea una nueva badge manenjando y utilizando el servicio de `BadgeService.createBadge()` con el parametro
 *  de badge que contiene los campos como el nombre de la badge `nameBadge` y su descripcion `descriptionBadge`.
 * @param {Object} req - Objeto de solicitud (request) para crear nueva publicacion.
 * @param {Object} res  - Objeto de respuesta (response) que contiene informacion sobre respuesta HTTP.
 *  @returns {Promise<void>} Promesa que no devuelve ningun valor explicito.
 */
async function createBadge(req, res) {
    try {
        const { nameBadge, descriptionBadge } = req.body;
        const { error: bodyError } = badgeBodySchema.validate(req.body);
        if (bodyError) return respondError(req, res, 400, bodyError.message);
        if (!req.file) return respondError(req, res, 400, 'No se subio imagen');

        const imageBuffer = req.file.buffer;
        const base64Image = imageBuffer.toString('base64');

        const badge = { nameBadge, descriptionBadge, imageBadge: base64Image}
        const [newBadge, badgeError] = await BadgeService.createBadge(badge);
        if (badgeError) return respondError(req, res, 400, badgeError);
        if (!newBadge) return respondError(req, res, 400, 'No se creo la insignia');
        respondSuccess(req, res, 201, newBadge);
    }catch (error) {
        handleError(error, 'badge.controller -> createBadge');
        respondError(req, res, 500, 'No se creo insignia');
    }
}
/**
 * Obtiene todas las insignias utilizando el servicio `BadgeService.getBadges()`.
 * @param {Object} req - Objeto de solitiud (request) para obtener todas las badges(insignias).
 * @param {Object} res - Objeto de respuesta (response) que contiene informacion sobre respuesta HTTP.
 * @returns {Promise<void>} Promesa que no devuelve ningun valor explicito.
 */
async function getBadges(req, res) {
    try {
        const [badges, badgesError] = await BadgeService.getBadges();
        if (badgesError) return respondError(req, res, 400, badgesError);
        if (!badges) return respondError(req, res, 400, 'No se encontraron insignias');

        respondSuccess(req, res, 200, badges);
    } catch (error) {
        handleError(error, 'badge.controller -> getBadges');
        respondError(req, res, 500, 'No se encontraron insignias');
    }
}
/**
 * Obtiene una insignia por su ID utilizando el servicio `BadgeService.getBadgeById(id)`.
 * @param {Object} req - Objeto de solicitud para obtener una insignia por su ID.
 * @param {string} req.params.id - ID de la insignia que se desea obtener.
 * @param {Object} res - Objeto de respuesta (response) que contiene informacion sobre respuesta HTTP.
 * @returns {Promise<void>} Promesa que no devuelve ningun valor explicito.
 */
async function getBadgeById(req, res) {
    try {
        const { id } = req.params;
        const [badge, badgeError] = await BadgeService.getBadgeById(id);
        if (badgeError) return respondError(req, res, 400, badgeError);
        if (!badge) return respondError(req, res, 400, 'No se encontro la insignia');

        const base64Image = badge.imageBadge;
        const badgeWithImage = {
            _id: badge._id,
            nameBadge: badge.nameBadge,
            descriptionBadge: badge.descriptionBadge,
            imageBadge: base64Image
        }
        respondSuccess(req, res, 200, badgeWithImage);
    } catch (error) {
        handleError(error, 'badge.controller -> getBadgeById');
        respondError(req, res, 500, 'No se encontro la insignia');
    }
}
/**
 * Actualiza una insignia existente utilizando el servicio `BadgeService.updateBadge(id, badge)`.
 * @param {Object} req - Objeto de solicitud para actualizar una insignia.
 * @param {Object} res - Objeto de respuesta (response) que contiene informacion sobre respuesta HTTP.
 * @returns {Promise<void>} Promesa que no devuelve ningun valor explicito.
 */
async function updateBadge(req, res) {
    try {
        const { id } = req.params;
        const { body, file } = req;

        const [updatedBadge, badgeError] = await BadgeService.updateBadge(id, body, file);
        if (badgeError) return respondError(req, res, 400, badgeError);
        if (!updatedBadge) return respondError(req, res, 400, 'No se encontro insignia asociada al id ingresado');

        respondSuccess(req, res, 200, { message: 'Insignia actualizada', data: updatedBadge });
    } catch (error) {
        handleError(error, 'badge.controller -> updateBadge');
        respondError(req, res, 500, 'No se pudo actualizar insignia');
    }
}
/**
 * Elimina una insignia existente utilizando el servicio `BadgeService.deleteBadge(id))`.
 * @param {Object} req - Objeto de solicitud para eliminar badge(insignia).
 * @param {string} req.params.id - ID de la insignia que se desea eliminar.
 * @param {Object} res - Objeto de respuesta (response) que contiene informacion sobre respuesta HTTP.
 * @returns {Promise<void>} Promesa que no devuelve ningun valor explicito.
 */
async function deleteBadge(req, res) {
    try {
        const { id } = req.params;
        const [badge, badgeError] = await BadgeService.deleteBadge(id);
        if (badgeError) return respondError(req, res, 400, badgeError);
        if (!badge) return respondError(req, res, 400, 'No se encontro insignia asociada al id ingresado');

        respondSuccess(req, res, 200, { message: 'Insignia eliminada', data: badge });
    } catch (error) {
        handleError(error, 'badge.controller -> deleteBadge');
        respondError(req, res, 500, 'No se pudo eliminar insignia');
    }
}
/**
 * Obtiene la imagen de una insignia por su ID utilizando el servicio `BadgeService.getBadgeById(id).
 * @param {Object} req - Objeto de solicitud para obtener la imagen de una insignia por su ID.
 * @param {string} req.params.id - ID de la insignia cuya imagen se desea obtener.
 * @param {Object} res - Objeto de respuesta (response) que contiene informacion sobre respuesta HTTP.
 * @returns {Promise<void>} Promesa que no devuelve ningun valor explicito.
 */
async function getBadgeImage(req, res){
    try {
        const { id } = req.params;
        const [badge, badgeError] = await BadgeService.getBadgeById(id);
        if (badgeError) return respondError(req, res, 400, badgeError);
        if (!badge) return respondError(req, res, 400, 'No se encontro la insignia');

        const base64Image = badge.imageBadge;
        const imageBuffer = Buffer.from(base64Image, 'base64');
        res.set('Content-Type', 'image/png');
        res.send(imageBuffer);
    } catch (error) {
        handleError(error, 'badge.controller -> getBadgeImage');
        respondError(req, res, 500, 'No se encontro la insignia');
    }
}

module.exports = {
    createBadge,
    getBadges,
    getBadgeById,
    updateBadge,
    deleteBadge,
    getBadgeImage
}