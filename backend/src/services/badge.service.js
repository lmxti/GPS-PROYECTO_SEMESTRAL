/* <----------------------- MODELOS --------------------------> */
const Badge = require('../models/badge.model');
const User = require("../models/user.model");

/* <----------------------- FUNCIONES ------------------------> */
// handleError: Funcion de registro y manejo de errores de manera centralizada 
const { handleError } = require('../utils/errorHandler');

/**
 * Servicio para crear una insignia(badge) utilizando datos proporcionados por el parametro badge
 * @param {Object} badge - Objeto que contiene el nombre, descripción y la imagen de la insignia.
 * @returns {Promise<Array>} - Promesa que resuelve un arreglo que contiene `[newBadge, null] o [null, error]`
 */
async function createBadge(badge){
    try{
        const { nameBadge, descriptionBadge, imageBadge } = badge;
        const newBadge = new Badge({ nameBadge, descriptionBadge, imageBadge });
        const newBadgeExists = await Badge.findOne({nameBadge: nameBadge});
        if(newBadgeExists) return [null, "Ya existe una badge con este nombre"];
        await newBadge.save();
        return [newBadge, null];
    }catch(error){
        handleError(error, 'badge.service -> createBadge');
        return [null, 'No se creo la insignia'];
    }
}
/**
 * Servicio que obtiene todas las insignias almacenadas en la base de datos.
 * @returns {Promise<Array>} - Retorna un arreglo con `[badges, null]` o en caso contrario `[null, error]`
 */
async function getBadges(){
    try{
        const badges = await Badge.find();
        return [badges, null];
    }catch(error){
        handleError(error, 'badge.service -> getBadges');
        return [null, 'No se encontraron insignias'];
    }
}
/**
 * Servicio que obtiene una insignia específica de la base de datos según su ID.
 * @param {string} id - ID de la insignia a buscar.
 * @returns {Promise<Array>} - Retorna la insignia encontrada como un arreglo `[badge, null]` y en caso de error `[null, error]`
 */
async function getBadgeById(id){
    try{
        const badge = await Badge.findById(id);
        return [badge, null];
    }catch(error){
        handleError(error, 'badge.service -> getBadgeById');
        return [null, 'No se encontro la insignia'];
    }
}
/**
 * Servicio que se encarga de actualizar una insignia en la base de datos.
 * @param {string} id - ID de la insignia a actualizar.
 * @param {Object} body - Objeto que contiene los nuevos datos de la insignia (nombre, descripción y/o imagen).
 * @returns {Promise<Array>} - Retorna un array con la insignia actualizada `[badgeUpdated, null]` o un mensaje de error si no se pudo actualizar `[null, error]`.
 */
async function updateBadge(id, body, file){
    try {
        const badge = await Badge.findById(id);
        if(!badge) return [null, 'No se encontro insignia asociada al id ingresado'];

        let badgeValues = {...body}

        if(file){
            const imageBuffer = file.buffer;
            const base64Image = imageBuffer.toString('base64');
            badgeValues.imageBadge = base64Image;
        }
        
        const badgeUpdated = await Badge.findByIdAndUpdate(id, badgeValues, { new: true})
        return [badgeUpdated, null];
    } catch (error) {
        handleError(error, 'badge.service -> updateBadge');
        return [null, 'No se pudo actualizar la insignia'];
    }
}
/**
 * Elimina una insignia de la base de datos según su ID.
 * @param {string} id - ID de la insignia a eliminar.
 * @returns {Promise<Array>} - 
 */
async function deleteBadge(id){
    try{
        const badge = await Badge.findByIdAndDelete(id);
        return [badge, null];
    }catch(error){
        handleError(error, 'badge.service -> deleteBadge');
        return [null, 'No se pudo eliminar la insignia'];
    }
}
/**
 * Asigna una insignia a un usuario en la base de datos.
 * @param {string} idBadge - ID de la insignia a asignar.
 * @param {string} idUser - ID del usuario al que se le asignará la insignia.
 * @returns {Promise<Array>} Promesa que contiene un array con el usuario y su insignia asignada `[userFound, null]` y en caso de error devuelve `[null, error]`
 */
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