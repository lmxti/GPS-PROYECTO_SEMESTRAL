/* <----------------------- MODELOS --------------------------> */
const User = require("../models/user.model");
const Role = require("../models/role.model");
/* <----------------------- FUNCIONES ------------------------> */
// handleError: Funcion de registro y manejo de errores de manera centralizada 
const { handleError } = require("../utils/errorHandler.js")

/** 
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
        const userEmailExists = await User.findOne({email: email})
        if(userEmailExists) return [ null, "Este email ya esta asociado a otro usuario"];
        const userNameExists = await User.findOne({username: username})
        if(userNameExists) return [ null, "Nombre de usuario ya en uso, intenta con otro"];
        const roleFound = await Role.find({nameRole: {$in: roleUser}});
        if(roleFound.length === 0){
            return [null, "El rol ingresado no existe"]
        } 
        const hisRoleUser = roleFound.map( role => role._id)
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
            profilePicture,
            roleUser: hisRoleUser
        });
        await newUser.save();
        return [newUser, null];
    } catch(error){
        handleError(error, "user.service -> createUser")
    }
}

/**
 * 
 * @returns 
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

async function getUser(id){
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

        // Verificar si el email es el mismo que el actual del usuario
        if (email === userFound.email) {
            delete updateFields.email; // Excluir el email de la actualización si es el mismo
        }

        // Verificar si el nombre de usuario es el mismo que el actual del usuario
        if (username === userFound.username) {
            delete updateFields.username; // Excluir el username de la actualización si es el mismo
        }

        // Realizar la actualización con los campos actualizados
        const userUpdated = await User.findByIdAndUpdate(
            id,
            updateFields,
            { new: true }
        );
        
        return [userUpdated, null];
    } catch (error) {
        handleError(error, "user.service -> updateUser");
        return [null, "Error al actualizar el usuario"];
    }
}

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
    getUser,
    updateUser,
    deleteUser
}