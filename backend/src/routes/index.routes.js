// Dependencias
const express = require('express');
const authRoutes = require("./auth.routes.js")
const userRoutes = require('./user.routes.js');

// Enrutador
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);



module.exports = router;