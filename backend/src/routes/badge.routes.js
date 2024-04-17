// Dependencias
const express = require('express');
// Controlador de insignias
const badgeController = require('../controllers/badge.controller');
const subirImagen = require('../middlewares/handleMulter.middleware');

// Enrutador
const router = express.Router();

router.post("/createBadge", subirImagen.single('imageBadge'), badgeController.createBadge);
router.get("/getBadges", badgeController.getBadges);
router.get("/getBadgeById/:id", badgeController.getBadgeById);
router.put("/updateBadge/:id",subirImagen.single('imageBadge'), badgeController.updateBadge);
router.delete("/deleteBadge/:id", badgeController.deleteBadge);

router.get("/getBadgeImage/:id", badgeController.getBadgeImage);

module.exports = router;