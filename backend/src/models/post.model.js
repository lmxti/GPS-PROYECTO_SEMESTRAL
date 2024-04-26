"use strict";

const { required } = require("joi");
const mongoose = require("mongoose")

const postSchema = new mongoose.Schema(
    {
        // Titulo principal de publicación.
        title: { type: String, required: true },
        // Contenido o descripcion de publicación.
        description: { type: String, required: true },
        // Imagenes incluidas en publicación
        images: [{ type: String }],
        // Fecha de creación de publicación
        createdAt: { type: Date, required: true, default: Date.now },
        // Estado de publicacion(abierta por default)
        status: { type: Boolean, default: true},

        /*<---------- Relaciones con otros modelos ----------> */

        // Autor de la publicación
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
        // Hashtag que tiene publicación
        hashtags: [ { type: mongoose.Schema.Types.ObjectId, ref: "Hashtag"}],
        // Interacciones de usuarios
        interactions: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
                type: { type: String, enum: ["helpful", "nothelpful"]}
            }
        ],
        // Comentarios de la publicación
        comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;