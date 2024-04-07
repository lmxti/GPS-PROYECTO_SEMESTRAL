"use strict";

const mongoose = require("mongoose");

const hashtagSchema = new mongoose.Schema(
    {
        // Texto o nombre de hashtag unico
        nameHashtag: { type: String, required: true, unique: true}
    }
);

const Hashtag = mongoose.model("Hashtag", hashtagSchema);

module.exports = Hashtag;