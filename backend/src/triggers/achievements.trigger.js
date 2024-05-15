// Este archivo contendra todas las verificaciones de logros que puede obtener un usuario al realizar alguna accion
// En caso de lograr un hito se da insignia, en caso contrario no pasa nada.
/* <----------------------- MODELOS --------------------------> */
const User = require("../models/user.model");
const Post = require("../models/post.model");

/* <----------------------- SERVICIOS ------------------------> */
const BadgeService = require("../services/badge.service.js");


async function checkAchievementsPost(userId){
    try {
        const postsUser = await Post.countDocuments({ author: userId});
        console.log(`El usuario tiene ${postsUser} publicaciones`);

        switch (postsUser) {
            case 1:
                console.log("Usuario debe recibir logro por primera publicacion");
                await BadgeService.assignBadge("66451777c4695387db79f9a4", userId);
                break;
            case 10:
                console.log("Usuario debe recibir logro por tener 10 publicaciones");
                break
            default:
                console.log("Usuario no hizo ningun logro");
                break;
                
        }

    } catch (error) {
        console.log(error);
    }
}


module.exports= {
    checkAchievementsPost
}