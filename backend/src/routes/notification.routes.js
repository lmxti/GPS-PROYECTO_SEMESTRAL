/* <----------------------- MODULOS --------------------------> */
const express = require('express');

/* <----------------------- CONTROLADOR ---------------------------> */
const notificationController = require('../controllers/notification.controller');

/* <------------------------ MIDDLEWARES ---------------------------> */
const authenticationMiddleware  = require("../middlewares/authentication.middleware.js");
const authorizationMiddleware  = require("../middlewares/authorization.middleware.js");

/* <------------------- ENRUTADOR TERCIARIO -----------------------> */
const router = express.Router();

router.post("/createNotification", notificationController.createNotification);
router.get("/getNotifications/:userId", notificationController.getNotifications);
router.get("/getNotification/:id", notificationController.getNotification);
router.put("/updateNotification/:id", notificationController.updateNotification);
router.delete("/deleteNotification/:id", notificationController.deleteNotification);
router.put("/notification/markAsRead/:id", notificationController.markAsRead);


module.exports = router;