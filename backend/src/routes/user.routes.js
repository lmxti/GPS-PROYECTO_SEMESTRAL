// Dependencias
const express = require('express');
// Controlador de usuarios
const userController = require('../controllers/user.controller');

// Enrutador
const router = express.Router();

router.post("/createUser", userController.createUser);
router.get("/getUsers", userController.getUsers);
router.get("/getUser/:id", userController.getUser);
router.put("/updateUser/:id", userController.updateUser);
router.delete("/deleteUser/:id", userController.deleteUser);

module.exports = router;