"use strict";

// Importamos los modelos de role y user
const Role = require("../models/role.model");
const User = require("../models/user.model");

/**
 * Crea los roles por defecto en la base de datos.
 * @async
 * @function createRoles
 * @returns {Promise<void>}
 */

// Funcion encargada de crear los roles si no hay ninguno en la base de datos
async function createRoles(){
    try{
        // Busca los roles y los cuenta
        const count = await Role.estimatedDocumentCount();
        // Si hay roles no es necesario y no hace nada
        if(count > 0) {
            return
        };
        // Crea los roles si no estan en la base de datos
        await Promise.all([
            new Role({ name: 'Usuario'}).save(),
            new Role({ name: 'Administrador'}).save(),
            new Role({ name: 'Moderador'}).save()
        ]);
        console.log("Roles creados correctamente")
    }catch(error){
        console.error(error);
    }
};

/**
 * Crea los usuarios por defecto en la base de datos.
 * @async
 * @function createUsers(){
 * @returns {Promise<void>}
 */

async function createUsers(){
    try{
        // Busca los usuarios y los cuenta
        const count = await User.estimatedDocumentCount();
        // Si hay usuarios no es necesario y no hace nada
        if(count > 0) {
            return
        };
        // Busca los roles
        const admin = await Role.findOne({ name: 'Administrador' });
        const user = await Role.findOne({ name: 'Usuario' });
        const moderador = await Role.findOne({ name: 'Moderador' });

        // Crea los usuarios si no estan en la base de datos
        await Promise.all([
            // Crea un usuario con el rol de administrador
            new User({ name: "admin", surname: "null", username: "Eladmin", description: "Soy el administrador", birthdate: "1990-05-15", gender: "Femenino", email: "admin@localhost.com", password: await User.encryptPassword("admin"), roleUser: [admin._id]}).save(),
            // Crea un usuario con el rol de usuario
            new User({ name: "user", surname: "null", username: "Eluser", description: "Soy el usuario", birthdate: "1990-05-15", gender: "Otro", email: "user@localhost.com", password: await User.encryptPassword("user"), roleUser: [user._id]}).save(),
            // Crea un usuario con el rol de moderador
            new User({ name: "moderador", surname: "null", username: "Elmoderador", description: "Soy el moderador", birthdate: "1990-05-15", gender: "Masculino", email: "moderador@localhost.com", password: await User.encryptPassword("moderador"), roleUser: [moderador._id]}).save()
        ]);
        console.log("Un usuario y un admin se ha creado correctamente")

    }catch(error){
        console.error(error);
    }
}

module.exports ={
    createRoles,
    createUsers
}