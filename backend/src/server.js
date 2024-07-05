const { PORT } = require('./config/env.config.js')
const express = require('express')
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser")
const indexRoutes = require("./routes/index.routes.js")
const { setupDB } = require('./config/db.config.js');
const path = require('path');
const { createRoles, createDefaultUsers, createBadgeRoles} = require("./config/initial.setup.js");

async function setupServer(){
  try {
    const server = express();
    server.use(express.json());
    server.use(cors({ origin: 'http://localhost:3000', credentials: true }));
    server.use(cookieParser());
    server.use(morgan("dev"));
    server.use(express.urlencoded({ extended: true }));
    server.use("/api", indexRoutes);
    server.use('/uploads', express.static(path.join(__dirname, 'uploads')));
    server.listen(PORT, () => {
      console.log(`SERVIDOR => El servidor está corriendo en: http://localhost:${PORT}/api`);
    })

  } catch (error) {
    console.log("Error", error);
  }
}

async function setupAPI() {
  try {
    await setupDB();
    await setupServer();
    await createRoles();
    await createBadgeRoles();
    await createDefaultUsers();
  } catch (error) {
    console.log("Error en setupAPI ",error);
  }
}

setupAPI()
  .then( () => console.log("setupAPI => API web, Servidor y configuracion predeterminada exitosa"))
  .catch( (error) => console.log("setupAPI => Error -> Ocurrio un error: ", error))