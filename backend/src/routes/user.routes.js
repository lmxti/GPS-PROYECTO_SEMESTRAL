/* <----------------------- DEPENDENCIAS --------------------------> */
const express = require('express');

/* <----------------------- CONTROLADOR ---------------------------> */
const userController = require('../controllers/user.controller');

/* <------------------------ MIDDLEWARES ---------------------------> */
const authenticationMiddleware  = require("../middlewares/authentication.middleware.js");
const authorizationMiddleware  = require("../middlewares/authorization.middleware.js");
const subirImagen = require("../middlewares/handleMulter.middleware.js");

/* <------------------- ENRUTADOR TERCIARIO -----------------------> */
const router = express.Router();

router.post("/createUser", subirImagen.single('profilePicture'), userController.createUser);
router.get("/getUsers", userController.getUsers);
router.get("/getUserByID/:id", userController.getUserByID);
router.put("/updateUser/:id", userController.updateUser);
router.delete("/deleteUser/:id", userController.deleteUser);

module.exports = router;