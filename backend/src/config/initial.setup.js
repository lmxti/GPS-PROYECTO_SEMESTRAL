"use strict";

/* <----------------------- MODELOS --------------------------> */
const Badge = require("../models/badge.model.js");
const Role = require("../models/role.model.js");
const User = require("../models/user.model.js");

/* <----------------------- TRIGGERS ------------------------> */
const { badgeForRol } = require("../triggers/badge.trigger.js");

/* <----------------------- UTILS ------------------------> */
const { readFileBase64 } = require("../utils/generalUtils.js");

/**
 * Crea los roles por defecto en la base de datos.
 * @async
 * @function createRoles
 * @returns {Promise<void>}
 */

// Funcion encargada de crear los roles si no hay ninguno en la base de datos
async function createRoles() {
  try {
    // Busca los roles y los cuenta
    const count = await Role.estimatedDocumentCount();
    // Si hay roles no es necesario y no hace nada
    if (count > 0) {
      return;
    }
    // Crea los roles si no estan en la base de datos
    await Promise.all([
      new Role({ nameRole: "Usuario" }).save(),
      new Role({ nameRole: "Administrador" }).save(),
      new Role({ nameRole: "Moderador" }).save()
    ]);
    console.log("initial.setup -> createRoles: Se han creado los roles default del sistema ");
  } catch (error) {
    console.error(error);
  }
}

async function createBadgeRoles(){
  try {
    const count = await Badge.estimatedDocumentCount();
    if (count > 0) {
      return;
    }

    const usuarioImage = readFileBase64("src/uploads/badges/usuario.png");
    const adminImage = readFileBase64("src/uploads/badges/administrador.png");
    const moderadorImage = readFileBase64("src/uploads/badges/moderador.png");

    if (!usuarioImage || !adminImage || !moderadorImage) {
      console.error("Error: No se pudieron leer las imágenes de las insignias.");
      return;
    }

    await Promise.all([
      new Badge({ nameBadge: "Usuario", descriptionBadge:"Usuario de la comunidad", imageBadge: readFileBase64("src/uploads/badges/usuario.png") }).save(),
      new Badge({ nameBadge: "Administrador", descriptionBadge:"Administrador de la comunidad", imageBadge: readFileBase64("src/uploads/badges/administrador.png") }).save(),
      new Badge({ nameBadge: "Moderador", descriptionBadge:"Moderador de la comunidad", imageBadge: readFileBase64("src/uploads/badges/moderador.png") }).save(),
    ])
    console.log("initial.setup -> createBadgeRoles: Se crearon las insignas default para cada tipo de rol: Usuario, Moderador y Administrador");
  } catch (error) {
    console.error(error);
  }
}

/**
 * Crea los usuarios por defecto en la base de datos.
 * @async
 * @function createUsers(){
 * @returns {Promise<void>}
 */

async function createDefaultUsers() {
  try {
    // Busca los usuarios y los cuenta
    const count = await User.estimatedDocumentCount();
    // Si hay usuarios no es necesario y no hace nada
    if (count > 0) {
      return;
    }
    // Busqueda de roles en la base de datos
    const admin = await Role.findOne({ nameRole: "Administrador" });
    const user = await Role.findOne({ nameRole: "Usuario" });
    const moderador = await Role.findOne({ nameRole: "Moderador" });

    // Crea los usuarios si no estan en la base de datos
    await Promise.all([
      /* <-------------------------- USUARIO ADMINISTRADOR DEFAULT --------------------------> */
      new User({
        name: "John Doe",
        surname: "null",
        username: "adm",
        description: "Soy el administrador",
        birthdate: "1990-05-15",
        gender: "Femenino",
        email: "admin@localhost.com",
        password: await User.encryptPassword("admin"),
        roleUser: [admin._id],
        badges: [{ badge: await badgeForRol(admin.nameRole)}]
      }).save(),
      /* <-------------------------------- USUARIO  DEFAULT --------------------------------> */
      new User({
        name: "Jane Doe",
        surname: "null",
        username: "user123",
        description: "Soy el usuario",
        birthdate: "1990-05-15",
        gender: "Otro",
        email: "user@localhost.com",
        password: await User.encryptPassword("user"),
        roleUser: [user._id],
        badges: [{ badge: await badgeForRol(user.nameRole)}]
      }).save(),
      /* <--------------------------- USUARIO MODERADOR DEFAULT ---------------------------> */
      new User({
        name: "Johne Doe",
        surname: "null",
        username: "Elmoderador",
        description: "Soy el moderador",
        birthdate: "1990-05-15",
        gender: "Masculino",
        email: "moderador@localhost.com",
        password: await User.encryptPassword("moderador"),
        roleUser: [moderador._id],
        badges: [{ badge: await badgeForRol(moderador.nameRole)}]
      }).save()
    ]);

    console.log("initial.setup -> createDefaultUsers: Se han creado los usuarios default del sistema: administrador, usuario y moderador");
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  createRoles,
  createDefaultUsers,
  createBadgeRoles
};
