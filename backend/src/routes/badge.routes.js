/* <----------------------- MODULOS --------------------------> */
const express = require('express');

/* <----------------------- CONTROLADOR ---------------------------> */
const badgeController = require('../controllers/badge.controller');

/* <------------------------ MIDDLEWARES ---------------------------> */
const authenticationMiddleware  = require("../middlewares/authentication.middleware.js");
const authorizationMiddleware  = require("../middlewares/authorization.middleware.js");
const subirImagen = require("../middlewares/handleMulter.middleware.js");

/* <------------------- ENRUTADOR TERCIARIO -----------------------> */
const router = express.Router();

router.post("/createBadge", subirImagen.single('imageBadge'), badgeController.createBadge);
router.get("/getBadges", badgeController.getBadges);
router.get("/getBadgeById/:id", badgeController.getBadgeById);
router.put("/updateBadge/:id",subirImagen.single('imageBadge'), badgeController.updateBadge);
router.delete("/deleteBadge/:id", badgeController.deleteBadge);

router.get("/getBadgeImage/:id", badgeController.getBadgeImage);

module.exports = router;