"use strict";

const mongoose = require("mongoose")

const postSchema = new mongoose.Schema(
    {
        // Titulo principal de publicación.
        title: { type: String, required: true },
        // Contenido o descripcion de publicación.
        description: { type: String, required: true },
        // Imagenes incluidas en publicación
        images: [{ type: String, required: true}],
        // Fecha de creación de publicación
        createdAt: { type: Date, required: true, default: Date.now },

        /*<---------- Relaciones con otros modelos ----------> */

        // Autor de la publicación
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
        // Hashtag que tiene publicación
        hashtags: [ { type: mongoose.Schema.Types.ObjectId, ref: "Hashtag"}],
        // Comentarios de la publicación
        comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;