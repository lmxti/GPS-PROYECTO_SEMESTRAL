/* <----------------------- MODULOS --------------------------> */
const express = require('express');

/* <----------------------- CONTROLADOR ---------------------------> */
const postController = require('../controllers/post.controller');

/* <------------------------ MIDDLEWARES ---------------------------> */
const authenticationMiddleware  = require("../middlewares/authentication.middleware.js");
const authorizationMiddleware  = require("../middlewares/authorization.middleware.js");
const subirImagen = require("../middlewares/handleMulter.middleware.js");

/* <------------------- ENRUTADOR TERCIARIO -----------------------> */
const router = express.Router();

router.post("/createPost",[subirImagen.array('images')], postController.createPost);
router.get("/getPosts", postController.getPosts);
router.get("/getPostByID/:id", postController.getPostByID);
router.get("/getUserPosts/:id", postController.getUserPosts);
router.put("/updatePost/:id", postController.updatePost);
router.delete("/deletePost/:id", postController.deletePost);

router.post("/markPostInteraction/:postId", postController.markPostInteraction);

module.exports = router;
