"use strict";

const mongoose = require("mongoose");

const hashtagSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            unique: true,
        },
        nameHashtag: {
            type: String,
            required: true,
        },
        descriptionHashtag: {
            type: String,
            required: true,
        }
    }
);

const Hashtag = mongoose.model("Hashtag", hashtagSchema);

module.exports = Hashtag;