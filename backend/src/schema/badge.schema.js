const Joi = require("joi");

const badgeBodySchema = Joi.object({
    nameBadge: Joi.string().required().messages({
        "string.empty": "El nombre de la insignia no puede estar vacio",
        "any.required": "El nombre de la insignia es un campo requerido",
        "string.base": "El nombre de la insignia debe ser de tipo texto",
    }),
    descriptionBadge: Joi.string().required().messages({
        "string.empty": "La descripción de la insignia no puede estar vacia",
        "any.required": "La descripción de la insignia es un campo requerido",
        "string.base": "La descripción de la insignia debe ser de tipo texto"
    })
}).messages({
    "object.unknow": "No se permiten campos adicionales"
});

module.exports = {
    badgeBodySchema
}