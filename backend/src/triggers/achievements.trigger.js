// Este archivo contendra todas las verificaciones de logros que puede obtener un usuario al realizar alguna accion
// En caso de lograr un hito se da insignia, en caso contrario no pasa nada.
/* <----------------------- MODELOS --------------------------> */
const User = require("../models/user.model");
const Post = require("../models/post.model");

/* <----------------------- SERVICIOS ------------------------> */
const BadgeService = require("../services/badge.service.js");

// Logros por cantidades de publicaciones
async function checkAchievementsPost(userId){
    try {
        const postsUser = await Post.find({ author: userId });
        console.log(`El usuario tiene ${postsUser.length} publicaciones`);

        // Verificacion de logros de cantidad de publicaciones de usuario
        switch (postsUser.length) {
            case 1:
                await BadgeService.assignBadge("Nivel 1", userId);
                break;
            case 2:
                await BadgeService.assignBadge("Nivel 2", userId);
                break
            case 5:
                await BadgeService.assignBadge("Nivel 3", userId);
                break
            case 10:
                await BadgeService.assignBadge("Nivel 4", userId);
                break
            default:
                console.log("Usuario no hizo ningun logro");
                break;
        }
        // Verificacion de primera publicacion con imagen(nes)
        const hasImagePost = postsUser.some(post => post.images.length > 0);
        if (hasImagePost) {
            await BadgeService.assignBadge("Post+Image", userId);
        }
    } catch (error) {
        console.log(error);
    }
}
// Logros por seguir a otro usuario
async function checkAchievementsFollows(userId){
    try {
        const userFound = await User.findById(userId).populate("followed").exec();
        if (!userFound) {
            console.log("Usuario no encontrado");
            return;
        }
        // Verifica si es la primera vez que sigue a alguien
        if (userFound.followed.length === 1) {
            // Asigna una insignia de "Primer Seguimiento" si es la primera vez
            await BadgeService.assignBadge("Amigos Nuevos", userId);
            console.log("Insignia de 'Amigos Nuevos' asignada");
        } else {
            console.log("El usuario ya debe tener la insignia, tiene mas de 1 seguido");
        }
    } catch (error) {
        console.log(error);
    }
}

// Logro por completar informacion de perfil
async function checkAchievementsDescription(userId){
    try {
        const userFound = await User.findById(userId);
        if (!userFound) return [null, "Usuario no encontrado"];
        if (userFound.description && userFound.description.trim() !== "") {
            // Verificar si el usuario ya tiene el logro de "Completar descripción"
            const hasBadge = userFound.badges.some(badge => badge.badge.toString() === "669c313778feb993f2fe1075");
            if (!hasBadge) {
                // Asignar el logro de "Completar descripción"
                await BadgeService.assignBadge("Sobre ti", userId);
                return [true, null];
            }
        }
        return [false, "Descripción no completa o logro ya otorgado"];
    } catch (error) {
        console.error("Error en checkAndAwardDescriptionBadge:", error);
        return [null, "Error al verificar o otorgar el logro"];
    }
}


module.exports= {
    checkAchievementsPost,
    checkAchievementsFollows,
    checkAchievementsDescription
}