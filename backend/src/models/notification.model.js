"use strict";

const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            unique: true,
        },
        contentNotification: {
            type: String,
            required: true,
        },
        dateNotification: {
            type: Date,
            required: true,
        },
        userNotified: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;