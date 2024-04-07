"use strict";

const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        // Contenido(textual) de la notificacion
        contentNotification: { type: String, required: true },
        // Fecha de notificacion
        dateNotification: { type: Date, required: true },
    }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;