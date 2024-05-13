/* <----------------------- MODELOS --------------------------> */
const Post = require("../models/post.model.js");
const User = require("../models/user.model.js");
const Badge = require("../models/badge.model.js");
const Role = require("../models/role.model.js");

/* <----------------------- FUNCIONES ------------------------> */
// handleError: Funcion de registro y manejo de errores de manera centralizada 
const { handleError } = require("../utils/errorHandler.js");

async function badgeForRol(nameRole) {
    try {
        let badge;
        switch (nameRole) {
            case "Administrador":
                badge = await Badge.findOne({ nameBadge: "Administrador" });
                break;
            case "Moderador":
                badge = await Badge.findOne({ nameBadge: "Moderador" });
                break;
            default:
                badge = await Badge.findOne({ nameBadge: "Usuario" });
                break;
        }
        // Verifica si se encontró la insignia
        if (!badge) {
            throw new Error(`No se encontró una insignia para el rol '${nameRole}'`);
        }
        return badge ? badge._id : null;
    } catch (error) {
        handleError(error, "badge.trigger -> badgeForRol");
    }
}

async function assignBadgePost(userId){
    try {
        
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    badgeForRol,
    assignBadgePost
}