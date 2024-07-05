"use strict";
/* <----------------------- MODULOS --------------------------> */
const mongoose = require("mongoose");

const hashtagSchema = new mongoose.Schema(
    {
        // Texto o nombre de hashtag unico
        nameHashtag: { type: String, required: true, unique: true},
        // Usuarios que siguen el hashtag
        followedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}]
    }
);

const Hashtag = mongoose.model("Hashtag", hashtagSchema);

module.exports = Hashtag;