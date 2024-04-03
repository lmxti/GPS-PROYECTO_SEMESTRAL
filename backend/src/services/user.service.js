const User = require("../models/user.model");
const Role = require("../models/role.model");
const { handleError } = require("../utils/errorHandler.js")

/** --------- CREATE ------------------
    * Crea un nuevo usuario en la base de datos
    * @param {Object} "user" es un objeto de usuario con sus datos
    * @returns {Promise} Promesa con el objeto de usuario creado.
*/

async function createUser(user){
    try{
        const {
            name,
            surname,
            username,
            description,
            birthdate,
            gender,
            email,
            password,
            joinedAt,
            profilePicture,
            roleUser
        } = user;

        // Busqueda y verificacion de email de usuario
        const userEmailExists = await User.findOne({email: email})
        if(userEmailExists) return [ null, "Este email ya esta asociado a otro usuario"];

        // Busqueda y verificacion de disponibilidad de nombre de usuario
        const userNameExists = await User.findOne({username: username})
        if(userNameExists) return [ null, "Nombre de usuario ya en uso, intenta con otro"];

        // Busqueda y verificacion de rol de usuario en modelo de "Role"
        const roleFound = await Role.find({name: {$in: roleUser}});
        if(roleFound.length === 0){
            return [null, "El rol ingresado no existe"]
        } 

        // Extraccion de id de roles encontrados
        const hisRoleUser = roleFound.map( role => role._id)

        const newUser = new User({
            name,
            surname,
            username,
            description,
            birthdate,
            gender,
            email,
            password: await Person.encryptPassword(pasword),
            joinedAt,
            profilePicture,
            roleUser: hisRoleUser
        });
        await newUser.save();
        return [newUser, null];
    } catch(error){
        handleError(error, "user.service -> createUser")
    }
}

module.exports = {
    createUser,
}