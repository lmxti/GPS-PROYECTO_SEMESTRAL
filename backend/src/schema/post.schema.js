"use strict"

const Joi = require('joi');

const postBodySchema = Joi.object({
    
    title: Joi.string().required().messages({
        "string.empty": "El titulo no puede estar vacio",
        "any.required": "El titulo es un campo requerido",
        "string.base": "El titulo debe ser de tipo texto"
    }),
    description: Joi.string().required().messages({
        "string.empty": "La descripcion no puede estar vacia",
        "any.required": "La descripcion es un campo requerido",
        "string.base": "La descripcion debe ser de tipo texto"
    }),
    images: Joi.array().items(Joi.string().required()).messages({
        "string.empty": "Los requisitos no pueden estar vacios",
        "any.required": "Los requisitos son un campo requerido",
        "string.base": "Los requisitos deben ser de tipo texto",
    }),
    author: Joi.string().required().messages({
        "string.empty": "El autor no puede estar vacío",
        "any.required": "El autor es un campo requerido",
        "string.base": "El autor debe ser de tipo texto"
    }).regex(/^[0-9a-fA-F]{24}$/).messages({
        "string.pattern.base": "El ID del autor debe ser un ID válido"
    })
})

module.exports = {
    postBodySchema
}