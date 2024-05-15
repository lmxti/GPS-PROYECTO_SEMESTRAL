/* <----------------------- MODULOS --------------------------> */
const express = require("express");

/* <----------------------- CONTROLADOR ---------------------------> */
const authController = require("../controllers/auth.controller.js");

/* <------------------- ENRUTADOR TERCIARIO -----------------------> */
const router = express.Router();

router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/refresh", authController.refresh);


module.exports = router;