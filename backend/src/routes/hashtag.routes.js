/* <----------------------- DEPENDENCIAS --------------------------> */
const express = require('express');

/* <----------------------- CONTROLADOR ---------------------------> */
const hashtagController = require('../controllers/hashtag.controller');

/* <------------------- ENRUTADOR TERCIARIO -----------------------> */
const router = express.Router();

router.post("/createHashtag", hashtagController.createHashtag);
router.get("/getHashtags", hashtagController.getHashtags);
router.get("/getHashtagById/:id", hashtagController.getHashtagById);
router.put("/updateHashtag/:id", hashtagController.updateHashtag);
router.delete("/deleteHashtag/:id", hashtagController.deleteHashtag);

module.exports = router;