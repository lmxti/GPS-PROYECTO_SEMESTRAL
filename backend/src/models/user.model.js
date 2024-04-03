"use strict";

const mongoose = require("mongoose");
const GENDER = require("../constants/gender.constants.js");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
    {
        // Nombre personal de usuario.
        name: { type: String, required: true},
        // Apellido personal de usuario
        surname: { type: String, required: true},
        // Nombre de usuario
        username: { type: String, required: true, unique: true },
        // Descripcion de usuario
        description: { type: String },
        // Fecha de nacimiento de usuario
        birthdate: { type: Date, required: true },
        // Genero de usuario
        gender: { type: String, enum: GENDER, required: true },
        // Email de usuario
        email: { type: String, required: true, unique: true },
        // Contrasena de usuario, se encripta con las funciones de mas abajo
        password: { type: String, required: true },
        // Fecha en la que usuario se registra
        joinedAt: { type: Date, default: Date.now, required: true },
        // Imagen de perfil de usuario
        profilePicture: { type: String, default: "default.jpg" },
        /*<-----------------------------------------------------------------------> */
        // Rol de usuario, por defecto ya es usuario
        roleUser: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
        // Publicaciones del usuario, por defecto es un array vacio "[]"
        posts: [ { type: mongoose.Schema.Types.ObjectId,ref: "Post"} ],
        // Insignias del usuario, por defecto es un array vacio "[]"
        badges: [ { type: mongoose.Schema.Types.ObjectId, ref: "Badge" }],
        // Comentarios pertenecientes al usuario, por defecto es un array vacio "[]"
        Comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment"} ],
        // Seguidos del usuario, por defecto es un array vacio "[]"
        followed: [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}],
        // Seguidores del usuario, por defecto es un array vacio "[]"
        followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}],
        // Hashtags que sigue el usuario, por defecto es un array vacio "[]"
        followedHashtags: [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    }, 
    { timestamps: true, versionKey: false }
);

// Encripta contrasena de usuario
userSchema.statics.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

// Compara contrasena de usuario
userSchema.statics.comparePassword = async (password, receivedPassword) => {
    return await bcrypt.compare(password, receivedPassword);
};

const User = mongoose.model("User", userSchema);
module.exports = User;