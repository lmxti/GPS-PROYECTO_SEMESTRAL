/* <----------------------- DEPENDENCIAS --------------------------> */
const express = require('express');

/* <-------------------- RUTAS ESPECIFICAS ------------------------> */
const authRoutes = require("./auth.routes.js");
const userRoutes = require('./user.routes.js');
const badgeRoutes = require('./badge.routes.js');
const hashtagRoutes = require('./hashtag.routes.js');

/* <------------------------ MIDDLEWARES ---------------------------> */
const authenticationMiddleware  = require("../middlewares/authentication.middleware.js");

/* <------------------- ENRUTADOR SECUNDARIO ----------------------> */
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/badges", badgeRoutes);
router.use("/hashtags", hashtagRoutes);

module.exports = router;