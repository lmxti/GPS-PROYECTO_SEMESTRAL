"use strict";
/* <----------------------- MODULOS --------------------------> */
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        // Contenido(textual) de la notificacion
        contentNotification: { type: String, required: true },
        // Fecha de notificacion
        dateNotification: { type: Date, required: true },
        // Usuario al que pertenece la notificacion
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        // Si la notificacion ha sido leida
        read: { type: Boolean, default: false },
    }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;