"use strict";
/* <----------------------- MODULOS --------------------------> */
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        // Comentario de usuario
        userComment: { type: String, required: true },
        // Imagen que se puede incorporar al comentario
        imageComment: [{ type: String }],
        // Archivo que se puede incorporar al comentario
        fileComment: { type: String },
        // Fecha en que se realiza comentario
        createdAt: { type: Date, required: true, default: Date.now },

        /*<---------- Relaciones con otros modelos ----------> */

        // Usuario que realiza el comentario
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", requird: true},
        // Publicacion que comenta usuario
        postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true}
    }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;