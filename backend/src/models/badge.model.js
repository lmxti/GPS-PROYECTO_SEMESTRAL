"use strict";
/* <----------------------- MODULOS --------------------------> */
const mongoose = require("mongoose");

const badgeSchema = new mongoose.Schema(
    {
        // Nombre de badge(insignia) único
        nameBadge: { type: String, required: true, unique: true},
        // Descripcion de badge(insignia)
        descriptionBadge: { type: String, required: true },
        // Imagen de badge(insignia)
        imageBadge: { type: String, required: true }
    }
);

const Badge = mongoose.model("Badge", badgeSchema);

module.exports = Badge;
