"use strict";
/* <----------------------- MODULOS --------------------------> */
const mongoose = require("mongoose");

/* <----------------------- CONSTANTES --------------------------> */
const REPORTS = require("../constants/reportType.constants.js");

const reportSchema = new mongoose.Schema(
    {
        // Tipo de reporte
        reportType: { type: String, enum: REPORTS, required: true },
        // Contenido de reporte (textual)
        contentReport: { type: String, required: true },
        // Fecha en que se realiza reporte
        dateReport: { type: Date, required: true, default: Date.now },
        // Estado del reporte (pendiente, resuelto)
        statusReport: { type: String, required: true, enum: ['pendiente', 'en revision', 'resuelto', 'rechazado', 'en espera', 'cerrado'], default: "pendiente" },

        /*<---------- Relaciones con otros modelos ----------> */

        // Usuario autor del reporte
        userReport: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
        // Publicacion/post que ha sido reportada
        postReport: { type: mongoose.Schema.Types.ObjectId, ref: "Post",
        },
    }
);

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;