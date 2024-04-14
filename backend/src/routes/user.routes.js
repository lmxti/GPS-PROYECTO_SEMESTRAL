/* <----------------------- DEPENDENCIAS --------------------------> */
const express = require('express');

/* <----------------------- CONTROLADOR ---------------------------> */
const userController = require('../controllers/user.controller');

/* <------------------------ MIDDLEWARES ---------------------------> */
const authenticationMiddleware  = require("../middlewares/authentication.middleware.js");
const authorizationMiddleware  = require("../middlewares/authorization.middleware.js")

/* <------------------- ENRUTADOR TERCIARIO -----------------------> */
const router = express.Router();

router.post("/createUser", userController.createUser);
router.get("/getUsers", userController.getUsers);
router.get("/getUser/:id", userController.getUser);
router.put("/updateUser/:id", userController.updateUser);
router.delete("/deleteUser/:id",[authenticationMiddleware, authorizationMiddleware.isAdmin], userController.deleteUser);

module.exports = router;