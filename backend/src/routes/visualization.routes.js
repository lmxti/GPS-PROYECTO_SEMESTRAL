/* <----------------------- DEPENDENCIAS --------------------------> */
const express = require('express');

/* <----------------------- CONTROLADOR ---------------------------> */
const visualizationController = require('../controllers/visualization.controller');

/* <------------------------ MIDDLEWARES ---------------------------> */
const authenticationMiddleware  = require("../middlewares/authentication.middleware.js");
const authorizationMiddleware  = require("../middlewares/authorization.middleware.js");


/* <------------------- ENRUTADOR TERCIARIO -----------------------> */
const router = express.Router();

router.get("/search", authenticationMiddleware, visualizationController.searchPosts);
router.get("/trending", authenticationMiddleware, visualizationController.getTrendingPosts);
router.get("/followed", authenticationMiddleware, visualizationController.getFollowedPosts);

module.exports = router;