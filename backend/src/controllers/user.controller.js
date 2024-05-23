/* <----------------------- SERVICIOS ------------------------> */
const UserService = require("../services/user.service.js");

/* <----------------------- SCHEMA ------------------------> */
const { userBodySchema, userIdSchema } = require("../schema/user.schema.js");

/* <----------------------- FUNCIONES ------------------------> */
// Funciones que manejan las respuestas HTTP exitosas/erroneas.
const { respondSuccess, respondError } = require("../utils/resHandler.js");
// handleError: Funcion de registro y manejo de errores de manera centralizada 
const { handleError } = require("../utils/errorHandler.js");

/**
 * Crea un usuario validando el id y utilizando el servicio 'UserService.createUser()' con el parametro
 * de body que contiene los campos basicos de usuario.
 * @param {Object} req -  Objeto de solitiud (request) para crear un usuario a partir de `req.body`.
 * @param {Object} res -  Objeto de respuesta (response) que contiene informacion sobre respuesta HTTP.
 * @returns {Promise<void>} Promesa que no devuelve ningun valor explicito.
 */
async function createUser(req, res){
    try{
        const { body } = req;
        const { error: bodyError } = userBodySchema.validate(body);
        if (bodyError) return respondError(req, res, 400, bodyError.message);
        const [newUser, UserError ] = await UserService.createUser(body, req.file);
        if (UserError) return respondError(req, res, 400, UserError);
        if (!newUser) return respondError(req, res, 400, "No se creo el usuario");
        respondSuccess(req, res, 201, newUser);
    } catch(error){
        handleError(error, "user.controller -> createUser");
        respondError(req, res, 500, "No se creo usuario");
    }      
}
/**
 * Obtiene todos los usuarios existentes utilizando el servicio 'UserService.getUsers()'
 * @param {Object} req - El objeto de solicitud (request) no se utiliza en esta funcion.
 * @param {Object} res - Objeto de respuesta (response) que contiene informacion sobre respuesta HTTP.
 * @returns {Promise<void>} Promesa que no devuelve ningun valor explicito.
 */
async function getUsers(req, res){
    try {
        const [users, errorUsers] = await UserService.getUsers();
        if (errorUsers) return respondError(res, 500, "Error al buscar usuarios");
        users.length === 0
            ? respondSuccess(req, res, 200, "No existen usuarios en la bbdd")
            : respondSuccess(req, res, 200, { message: "Se encontraron los siguientes usuarios: ", data: users})
    } catch (error) {
        handleError(error, "user.controller -> getUser");
        respondError(req, res, 500, "No se pudo encontrar usuarios");

    }
}
/**
 * Busca y obtiene un usuario existente utilizando el servicio 'UserService.getUserByID()' que utiliza
 * el id proveniente de los parametros.
 * @param {Object} req - El objeto de solicitud (request) no se utiliza en esta funcion.
 * @param {Object} res - Objeto de respuesta (response) que contiene informacion sobre respuesta HTTP.
 * @returns {Promise<void>} Promesa que no devuelve ningun valor explicito.
 */
async function getUserByID(req, res){
    try{
        const { params } = req;
        const { error: paramsError } = userIdSchema.validate(params);
        if(paramsError) return respondError(req, res, 400, paramsError.message);
        const [ user, userError ] = await UserService.getUserByID(params.id);
        if(userError) return respondError(req, res, 404, userError);
        respondSuccess(req, res, 200, user);
    } catch(error){
        handleError(error, "user.controller -> getUserByID");
        respondError(req, res, 500, "No se pudo encontrar usuario");
    }
}
/**
 * Obtiene la imagen de perfil de un usuario por su ID y la envía como respuesta al cliente.
 * @param {Object} req - El objeto de solicitud (request) no se utiliza en esta funcion.
 * @param {Object} res - Objeto de respuesta (response) que contiene informacion sobre respuesta HTTP.
 * @returns 
 */
async function getUserImageByID(req, res){
    try {
        const { id } = req.params;
        const [filePath, error] = await UserService.getUserImageByID(id);
        if (error) return respondError(req, res, 404, error);

        res.sendFile(filePath);
    } catch (error) {
        handleError(error, "user.controller -> getUserImageByID");
        respondError(req, res, 500, "No se pudo encontrar la imagen de perfil del usuario");
    }
}


/**
 * Busca y actualiza campos de datos de usuario existente utilizando el servicio 'UserService.updateUser()' que
 * recibe como parametros el id de usuario a modificar y el body que contiene los campos a modificar.
 * @param {Object} req - El objeto de solicitud (request) contiene el id en `req.params` y las modificaciones en el body de la solicitud
 * @param {Object} res - Objeto de respuesta (response) que contiene informacion sobre respuesta HTTP
 * @returns 
 */
async function updateUser(req, res){
    try {
        const { id } = req.params;
        const { body } = req;
        const [user, userError] = await UserService.updateUser(id, body);
        if(userError) return respondError(req, res, 400, userError);
        if(!user) return respondError(req, res, 400, "No se encontro usuario asociado al id ingresado");
        respondSuccess(req, res, 200, { message: "Usuario actualizado", data: user});
    } catch (error) {
        handleError(error, "user.controller -> updateUser");
        respondError(req, res, 500, "No se actualizo usuario")
    }
}
/**
 * Busca y elimina un usuario existente utilizando el servicio 'UserService.deleteUser()' que recibe como parametro
 * el id de usuario a eliminar.
 * @param {Object} req - EL objeto de la solicitud (request) contiene el id de publicacion en `req.params`.
 * @param {Object} res - Objeto de respuesta (response) que contiene informacion sobre respuesta HTTP.
 * @returns {Promise<void>} Promesa que no devuelve ningun valor explicito.
 * 
 */
async function deleteUser(req, res){
    try {
        const { id } = req.params;
        const user = await UserService.deleteUser(id);
        !user
            ? respondError(req, res, 400, "No se elimino usuario")
            : respondSuccess(req, res, 200, { message:"Usuario eliminado con exito", data: user})
    } catch (error) {
        handleError(error, "user.controller -> deleteUser");
    }
}

module.exports = {
    createUser,
    getUsers,
    getUserByID,
    getUserImageByID,
    updateUser,
    deleteUser
}