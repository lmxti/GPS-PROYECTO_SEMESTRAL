/* <----------------------- MODULOS --------------------------> */
// jwt: Modulo para generacion y verificacion de tokens 
const jwt = require("jsonwebtoken")

/* <----------------------- MODELOS --------------------------> */
const User = require("../models/user.model.js");

/* <----------------------- FUNCIONES ------------------------> */
// handleError: Funcion de registro y manejo de errores de manera centralizada 
const { handleError } = require("../utils/errorHandler.js");

/* <--------------------- V. DE ENTORNO ----------------------> */
const { ACCESS_JWT_SECRET, REFRESH_JWT_SECRET} = require("../config/env.config")

/**
 * Inicia sesion de usuario
 * @async
 * @function login
 * @param {Object} credentials - Objeto que contiene credenciales de usuario: email y password
 */
async function login(credentials){
    try {
        const { email, password } = credentials;
        console.log(email, password);

        // Busqueda y verificacion de usuario
        const userFound = await User.findOne({email: email})
            .populate("roleUser")
            .exec();
        if(!userFound) return [null, null, "No se encontro usuario"];

        // Busqueda y comparacion entre contrasena ingresada y contrasena de usuario
        const matchPassword = await User.comparePassword(password, userFound.password);
        if (!matchPassword) return [null, null, "Error de contrasena, intenta nuevamente"];

        // Creacion o firma de token JWT
        const accessToken = jwt.sign(
            // Payload: Contiene informacion a incluir en el token
            { email: userFound.email, roleUser: userFound.roleUser, id: userFound._id },
            // Clave secreta para firmar validez de token
            ACCESS_JWT_SECRET,
            // Tiempo de expiracion
            { expiresIn: "1d"}
        );

        // Creacion de token de refresco JWT
        const refreshToken = jwt.sign(
            // Payload: Contiene informacion a incluir en el token
            { email: userFound.email },
            // Clave secreta para firmar validez de token
            REFRESH_JWT_SECRET,
            // Tiempo de expiracion
            { expiresIn: "7d"}
        )
        return [accessToken, refreshToken, null];
    } catch (error) {
        handleError(error, "auth.service -> login")
    }
}

/**
 * Refresca el token de acceso JWT
 * @async
 * @function refresh
 * @param {Object} cookies - Objeto que contiene las cookies, incluido el token de refresco
 */
async function refresh(cookies){
    try {
        if (!cookies.jwt) return [null, "No hay autorización"];
        const refreshToken  = cookies.jwt;

        const accessToken = await jwt.verify(
            refreshToken ,
            REFRESH_JWT_SECRET,
            async (err, user) =>{
                if(err) return [null, "La sesion ha cadudado, vuelva a iniciar sesion"];
                const userFound = await User.findOne({email: user.email})
                    .populate("roleUser")
                    .exec();
                if(!userFound) return [null, "No se encontro usuario autorizado"];

                const accessToken = jwt.sign(
                    { email: userFound.email, roleUser: userFound.roleUser},
                    ACCESS_JWT_SECRET,
                    { expiresIn: "1d"}
                );
                return [accessToken, null]
            }
        );
        return accessToken;
    } catch (error) {
        handleError(error, "auth.service -> refresh");
    }
}

const crypto = require('crypto');

/**
 * Servicio para manejar el olvido de contraseña de un usuario.
 * @param {string} email - Correo electrónico del usuario.
 * @returns {Promise<[Object, string]>} Promesa que devuelve un objeto de usuario y un error si existe.
 */
async function forgotPassword(email) {
    try {
        // Buscar al usuario por correo electrónico
        const user = await User.findOne({ email });
        if (!user) {
            return [null, "No se encontró un usuario con ese correo electrónico"];
        }

        // Generar token de restablecimiento de contraseña
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Guardar el token de restablecimiento de contraseña y la fecha de vencimiento en el usuario
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
        await user.save();

        return [user, null];
    } catch (error) {
        return [null, error.message];
    }
}

/**
 * Servicio para manejar el restablecimiento de contraseña de un usuario.
 * @param {string} token - Token de restablecimiento de contraseña.
 * @param {string} newPassword - Nueva contraseña del usuario.
 * @returns {Promise<[Object, string]>} Promesa que devuelve un objeto de usuario y un error si existe.
 */
async function resetPassword(token, newPassword) {
    try {
        // Buscar al usuario por el token de restablecimiento de contraseña
        const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
        if (!user) {
            return [null, "El token de restablecimiento de contraseña es inválido o ha expirado"];
        }

        // Establecer la nueva contraseña y limpiar el token de restablecimiento de contraseña y la fecha de vencimiento
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return [user, null];
    } catch (error) {
        return [null, error.message];
    }
}

module.exports = {
    login,
    refresh,
    forgotPassword,
    resetPassword
}