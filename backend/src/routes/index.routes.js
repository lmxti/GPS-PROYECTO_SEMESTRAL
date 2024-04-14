/* <----------------------- DEPENDENCIAS --------------------------> */
const express = require('express');

/* <-------------------- RUTAS ESPECIFICAS ------------------------> */
const authRoutes = require("./auth.routes.js")
const userRoutes = require('./user.routes.js');

/* <------------------- ENRUTADOR SECUNDARIO ----------------------> */
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);

module.exports = router;