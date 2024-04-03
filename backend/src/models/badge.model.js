"use strict";

const mongoose = require("mongoose");

const badgeSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            unique: true,
        },
        nameBadge: {
            type: String,
            required: true,
        },
        descriptionBadge: {
            type: String,
            required: true,
        },
        imageBadge: {
            type: String,
            required: true,
        }
    }
);

const Badge = mongoose.model("Badge", badgeSchema);

module.exports = Badge;
