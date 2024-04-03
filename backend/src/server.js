const { PORT } = require('./config/env.config.js')

const express = require('express')

const server = express()

const { setupDB } = require('./config/db.config.js');

server.use(express.json());

server.listen(PORT, () => {
  console.log(`Ejemplo del servidor corriendo en el puerto: ${PORT}`)
  setupDB();
})