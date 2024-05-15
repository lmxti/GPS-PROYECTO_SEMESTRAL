/* <----------------------- MODULOS --------------------------> */
// Importamos connect desde mongoose para conectarnos a la base de datos
const mongoose = require("mongoose");

/* <--------------------- V. DE ENTORNO ----------------------> */
const { DB_URL } = require("./env.config.js");


// Configuracion de la base de datos
const options = {
  // useNewUrlParser: true, OBSOLETA
  // useUnifiedTopology: true, OBSOLETA
};

/**
 *@name setupDB
 *@description Función que se encarga de conectar la base de datos
 *@returns {Promise<void>}
 *@throws {Error}
 */
async function setupDB() {
  try {
    await mongoose.connect(DB_URL, options);
    console.log("BBDD => Conexión exitosa a la base de datos");
  } catch (error) {
    handleError(error, "/db.config -> setupDB");
  }
}

module.exports = { setupDB };