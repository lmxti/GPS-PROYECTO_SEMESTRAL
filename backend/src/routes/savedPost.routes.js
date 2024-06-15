/* <----------------------- DEPENDENCIAS --------------------------> */
const express = require('express');

/* <----------------------- CONTROLADOR ---------------------------> */
const SavedPostsController = require('../controllers/savedPosts.controller.js');

/* <------------------------ MIDDLEWARES ---------------------------> */
const authenticationMiddleware  = require("../middlewares/authentication.middleware.js");
const authorizationMiddleware  = require("../middlewares/authorization.middleware.js");

/* <------------------- ENRUTADOR TERCIARIO -----------------------> */
const router = express.Router();

router.get('/:id/saved-posts', SavedPostsController.getSavedPosts);
router.delete('/:id/saved-posts', SavedPostsController.removeSavedPost);

module.exports = router;