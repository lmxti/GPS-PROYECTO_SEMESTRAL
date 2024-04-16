const User = require("../models/user.model.js");
/* <----------------------- SERVICIOS ------------------------> */
const UserService = require("../services/user.service.js");

/* <----------------------- SCHEMA ------------------------> */
const { userBodySchema, userIdSchema } = require("../schema/user.schema.js");

/* <----------------------- FUNCIONES ------------------------> */
// Funciones que manejan las respuestas HTTP exitosas/erroneas.
const { respondSuccess, respondError } = require("../utils/resHandler.js");
// handleError: Funcion de registro y manejo de errores de manera centralizada 
const { handleError } = require("../utils/errorHandler.js");

async function createUser(req, res){
    try{
        const { body } = req;
        const { error: bodyError } = userBodySchema.validate(body);
        if (bodyError) return respondError(req, res, 400, bodyError.message);

        const [newUser, UserError ] = await UserService.createUser(body);
        if (UserError) return respondError(req, res, 400, UserError);
        if (!newUser) return respondError(req, res, 400, "No se creo el usuario");
        respondSuccess(req, res, 201, newUser);
    } catch(error){
        handleError(error, "user.controller -> createUser");
        respondError(req, res, 500, "No se creo usuario");
    }      
}

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

async function getUser(req, res){
    try{
        const { params } = req;
        const { error: paramsError } = userIdSchema.validate(params);
        if(paramsError) return respondError(req, res, 400, paramsError.message);
        const [ user, userError ] = await UserService.getUser(params.id);
        if(userError) return respondError(req, res, 404, userError);
        respondSuccess(req, res, 200, user);
    } catch(error){
        handleError(error, "user.controller -> getUser");
        respondError(req, res, 500, "No se pudo encontrar usuario");
    }
}

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
    getUser,
    updateUser,
    deleteUser
}