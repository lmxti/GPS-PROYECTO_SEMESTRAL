/* <----------------------- SERVICIOS ------------------------> */
const BadgeService = require('../services/badge.service');
/* <----------------------- SCHEMA ------------------------> */
const { badgeBodySchema } = require('../schema/badge.schema');
/* <----------------------- FUNCIONES ------------------------> */
// Funciones que manejan las respuestas HTTP exitosas/erroneas.
const { respondSuccess, respondError } = require('../utils/resHandler');
// handleError: Funcion de registro y manejo de errores de manera centralizada
const { handleError } = require('../utils/errorHandler');

async function createBadge(req, res) {
    try {
        console.log(req);
        const { nameBadge, descriptionBadge } = req.body;
        const { error: bodyError } = badgeBodySchema.validate(req.body);
        if (bodyError) return respondError(req, res, 400, bodyError.message);
        if (!req.file) return respondError(req, res, 400, 'No se subio imagen');

        const imageBuffer = req.file.buffer;
        const base64Image = imageBuffer.toString('base64');

        const badge = { nameBadge, descriptionBadge, imageBadge: base64Image
        }

        const [newBadge, badgeError] = await BadgeService.createBadge(badge);
        if (badgeError) return respondError(req, res, 400, badgeError);
        if (!newBadge) return respondError(req, res, 400, 'No se creo la insignia');

        respondSuccess(req, res, 201, newBadge);
    }catch (error) {
        handleError(error, 'badge.controller -> createBadge');
        respondError(req, res, 500, 'No se creo insignia');
    }
}

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

async function updateBadge(req, res) {
    try {
        const { id } = req.params;
        const { nameBadge, descriptionBadge, imageBadge } = req.body;
        const imageBuffer = req.file.buffer;
        const base64Image = imageBuffer.toString('base64');
        const badge = {
            nameBadge,
            descriptionBadge,
            imageBadge: base64Image
        }
        const [updatedBadge, badgeError] = await BadgeService.updateBadge(id, badge);
        if (badgeError) return respondError(req, res, 400, badgeError);
        if (!updatedBadge) return respondError(req, res, 400, 'No se encontro insignia asociada al id ingresado');

        respondSuccess(req, res, 200, { message: 'Insignia actualizada', data: updatedBadge });
    } catch (error) {
        handleError(error, 'badge.controller -> updateBadge');
        respondError(req, res, 500, 'No se pudo actualizar insignia');
    }
}

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