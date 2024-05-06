/* <----------------------- MODELOS --------------------------> */
const Badge = require('../models/badge.model');
const User = require("../models/user.model");

/* <----------------------- FUNCIONES ------------------------> */
// handleError: Funcion de registro y manejo de errores de manera centralizada 
const { handleError } = require('../utils/errorHandler');

async function createBadge(badge){
    try{
        const { nameBadge, descriptionBadge, imageBadge } = badge;
        const newBadge = new Badge({ nameBadge, descriptionBadge, imageBadge });
        await newBadge.save();
        return [newBadge, null];
    }catch(error){
        handleError(error, 'badge.service -> createBadge');
        return [null, 'No se creo la insignia'];
    }
}

async function getBadges(){
    try{
        const badges = await Badge.find();
        return [badges, null];
    }catch(error){
        handleError(error, 'badge.service -> getBadges');
        return [null, 'No se encontraron insignias'];
    }
}

async function getBadgeById(id){
    try{
        const badge = await Badge.findById(id);

        const badgeWithImage= {
            _id: badge._id,
            nameBadge: badge.nameBadge,
            descriptionBadge: badge.descriptionBadge,
            imageBadge: badge.imageBadge
        }
        return [badgeWithImage, null];
    }catch(error){
        handleError(error, 'badge.service -> getBadgeById');
        return [null, 'No se encontro la insignia'];
    }
}

async function updateBadge(id, body){
    try {
        const { nameBadge, descriptionBadge, imageBadge } = body;
        const badgeFound = await Badge.findById(id);
        if(!badgeFound) return [null, 'No se encontro insignia asociada al id ingresado'];
        badgeFound.nameBadge = nameBadge;
        badgeFound.descriptionBadge = descriptionBadge;
        badgeFound.imageBadge = imageBadge;
        await badgeFound.save();
        return [badgeFound, null];
    } catch (error) {
        handleError(error, 'badge.service -> updateBadge');
        return [null, 'No se pudo actualizar la insignia'];
    }
}

async function deleteBadge(id){
    try{
        const badge = await Badge.findByIdAndDelete(id);
        return [badge, null];
    }catch(error){
        handleError(error, 'badge.service -> deleteBadge');
        return [null, 'No se pudo eliminar la insignia'];
    }
}

async function assignBadge(idBadge, idUser){
    try {
        const badgeFound = await Badge.findById(idBadge);
        if(!badgeFound) return [null, "No se encontro insignia"]

        const userFound = await User.findById(idUser);
        if(!userFound) return [null, "No se encontro usuario"]

        const userHasThisBadge = userFound.badges.some(item => item.badge.toString() === idBadge);
        if (userHasThisBadge) return [null, "El usuario ya tiene esta insignia"];
        userFound.badges.push({badge: idBadge, dateObtained: Date.now()})
        await userFound.save();
        return [userFound, null];
    } catch (error) {
        handleError(error, 'badge.service -> assignBadge');
        return [null, 'No fue posible dar insignia'];
    }
}

module.exports = {
    createBadge,
    getBadges,
    getBadgeById,
    updateBadge,
    deleteBadge,
    assignBadge
}