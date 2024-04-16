const Joi = require("joi");

const hashtagBodySchema = Joi.object({
    nameHashtag: Joi.string().required().messages({
        "string.empty": "El nombre del hashtag no puede estar vacio",
        "any.required": "El nombre del hashtag es un campo requerido",
        "string.base": "El nombre del hashtag debe ser de tipo texto"
    })
}).messages({
    "object.unknow" : "No se permiten campos adicionales"
});

module.exports = {
    hashtagBodySchema
}