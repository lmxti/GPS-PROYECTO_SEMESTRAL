// Dependencias
const express = require('express');
const userRoutes = require('./user.routes.js');

// Enrutador
const router = express.Router();

router.use("/users", userRoutes);



module.exports = router;