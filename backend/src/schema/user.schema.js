const Joi = require("joi");
const ROLES = require("../constants/role.constants.js");


const userBodySchema = Joi.object({
    name: Joi.string().required().messages({
        "string.empty": "El nombre no puede estar vacio",
        "any.required": "El nombre es un campo requerido",
        "string.base": "El nombre debe ser de tipo texto"
    }),
    surname: Joi.string().required().messages({
        "string.empty": "El apellido no puede estar vacio",
        "any.required": "El apellido es un campo requerido",
        "string.base": "El apellido debe ser de tipo texto"
    }),
    username: Joi.string().required().messages({
        "string.empty": "El nombre de usuario no puede estar vacio",
        "any.required": "El nombre de usuario es un campo requerido",
        "string.base": "El nombre de usuario debe ser de tipo texto"
    }),
    description: Joi.string().allow("").optional().messages({
        "string.base": "La descripción debe ser de tipo texto"
    }),
    birthdate: Joi.date().required().messages({
        "string.empty": "La fecha de nacimiento no puede estar vacia",
        "any.required": "La fecha de nacimiento es un campo requerido",
        "string.base": "La fecha de nacimiento debe ser de tipo texto"
    }),
    gender: Joi.string().required().messages({
        "string.empty": "El genero no puede estar vacio",
        "any.required": "El genero es un campo requerido",
        "string.base": "El genero debe ser de tipo texto"
    }),
    email: Joi.string().required().messages({
        "string.empty": "El correo electronico no puede estar vacio",
        "any.required": "El correo electronico es un campo requerido",
        "string.base": "El correo electronico debe ser de tipo texto",
        "string.email": "El correo electronico debe ser valido"
    }),
    password: Joi.string().required().min(5).messages({
        "string.empty": "La contrasena no puede estar vacia",
        "any.required": "La contrasena es un campo requerido",
        "string.base": "La contrasena debe ser de tipo texto",
        "string.min": "La contrasena debe tener al menos 5 caracteres"
    }),
    roleUser: Joi.array().items(Joi.string().valid(...ROLES))
    .required()
    .messages({
        "string.empty": "El rol no puede estar vacio",
        "string.base": "El rol debe ser de tipo texto",
        "any.only": "El rol debe ser valido"
    })
}).messages({
    "object.unknow" : "No se permiten campos adicionales"
});

// Validacion de campo id de usuario.
const userIdSchema = Joi.object({
    id: Joi.string()
    .required()
    .pattern(/^(?:[0-9a-fA-F]{24}|[0-9a-fA-F]{12})$/)
    .messages({
        "string.empty": "El id no puede estar vacio",
        "any.required": "El id es un campo requerido",
        "string.base": "El id debe ser de tipo texto",
        "string.pattern.base": "El id debe ser un identificador valido"
    }),
})

module.exports = { 
    userBodySchema, userIdSchema
}