/* <----------------------- MODELOS --------------------------> */
const User = require("../models/user.model");
const Role = require("../models/role.model");

/* <----------------------- FUNCIONES ------------------------> */
// handleError: Funcion de registro y manejo de errores de manera centralizada 
const { handleError } = require("../utils/errorHandler.js");

/* <----------------------- UTILS ------------------------> */
const { saveImageProfile } = require("../utils/generalUtils.js");

/* <----------------------- TRIGGERS ------------------------> */
const { badgeForRol } = require("../triggers/badge.trigger.js");

/** 
    * Servicio para crear un usuario utilizando datos proporcionados por el parametro 'user'
    * @param {Object} user - Objeto que contiene datos necesarios como 'name', surname', 'email', etc. para crear un usuario.
    * @returns {Promise} Promesa con el objeto de usuario creado.
*/
async function createUser(user, file = null){
    try{
        const { name,
            surname,
            username,
            description,
            birthdate,
            gender,
            email,
            password,
            joinedAt,
            profilePicture,
            roleUser = ["Usuario"],
        } = user;
        const userEmailExists = await User.findOne({email: email})
        if(userEmailExists) return [ null, "Este email ya esta asociado a otro usuario"];
        const userNameExists = await User.findOne({username: username})
        if(userNameExists) return [ null, "Nombre de usuario ya en uso, intenta con otro"];

        const roleFound = await Role.find({nameRole: {$in: roleUser}});
        if(roleFound.length === 0) return [null, "El rol ingresado no existe"];


        const hisRoleUser = roleFound.map( role => role._id);

        const badgeId = await badgeForRol(roleFound.nameRole);
        if (!badgeId) return [null, "No se encontró una insignia correspondiente para este rol"];

        const imgPicture = await saveImageProfile(file);

        const newUser = new User({
            name,
            surname,
            username,
            description,
            birthdate,
            gender,
            email,
            password: await User.encryptPassword(password),
            joinedAt,
            profilePicture: imgPicture ,
            roleUser: hisRoleUser,
            badges: [{ badge: badgeId, dateObtained: Date.now()}]
        });


        await newUser.save();
        return [newUser, null];
    } catch(error){
        handleError(error, "user.service -> createUser")
    }
}
/**
 * Servicio para obtener todos los usuarios existentes
 * @returns {Promise<Array>} Promesa que resuelve a un arreglo que contiene `[users, null] si tiene éxito o `[null, mensaje de error]` si falla.
 */
async function getUsers(){
    try {
        const users = await User.find()
        .populate("roleUser")
        .exec();
        if(!users) return [null, "No se encontraron usuarios en la bbdd"]
        return [users, null]
    } catch (error) {
        handleError(error, "user.service -> getUsers");
    }
}
/**
 * Servicio de busqueda y obtencion de usuario existente a traves de su id
 * @param {string} id - id de usuario a obtener 
 * @returns {Promise<Array>} Promesa que resuelve a un arreglo que contiene `[user, null] si tiene éxito o `[null, mensaje de error]` si falla.
 */
async function getUserByID(id){
    try {
        const user = await User.findById({ _id: id })
            .select("-password")
            .populate("roleUser")
            .exec();
        if(!user) return [null, "No existe un usuario asociado al id ingresado"];
        return [user, null]
    } catch (error) {
        handleError(error, "user.service -> getUser");
    }
}
/**
 * Servicio para actualizar los campos de un usuario existente,
 * @param {string} id - ID de usuario a actualizar 
 * @param {Object} body - Objeto que contiene los campos a utilizar como 'name','email', etc.
 * @returns {Promise<Array>} Promesa que resuelve un arreglo que contiene `[userUpdateduserUpdated, null] si tiene éxito o `[null, mensaje de error]` si falla.
 */
async function updateUser(id, body) {
    try {
        const userFound = await User.findById(id);
        if (!userFound) return [null, "No existe usuario asociado al id ingresado"];
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
        } = body;

        let updateFields = {
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
        };
        if (email === userFound.email) delete updateFields.email;
        if (username === userFound.username) delete updateFields.username;

        const userUpdated = await User.findByIdAndUpdate(id,updateFields,{ new: true });
        return [userUpdated, null];
    } catch (error) {
        handleError(error, "user.service -> updateUser");
        return [null, "Error al actualizar el usuario"];
    }
}
/**
 * Servicio para eliminar un usuario existente por su ID
 * @param {string} id - ID de usuario a eliminar
 * @returns {Promise<Array>} Promesa que resuelve un arreglo que contiene `[userDeleted, null] si tiene éxito o `[null, mensaje de error]` si falla.
 */
async function deleteUser(id){
    try {
        const userDeleted = await User.findByIdAndDelete(id);
        if(!userDeleted) return [null, "No existe usuario asociado al id ingresado"];
        return [userDeleted, null];
    } catch (error) {
        handleError(error, "user.service -> deleteUser");
    }
}

module.exports = {
    createUser,
    getUsers,
    getUserByID,
    updateUser,
    deleteUser
}