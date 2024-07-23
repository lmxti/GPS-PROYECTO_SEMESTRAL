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
router.post("/savePostAsFavorite/:postId", postController.savePostAsFavorite);
router.get("/getUserFavoritePosts/:userId", postController.getUserFavoritePosts);
router.get("/getSharedAndSavedPosts/:userId", postController.getSharedAndSavedPosts);
router.post("/sharePost/:postId", postController.sharePost);
router.get("/getSharedPosts/:userId", postController.getSharedPosts);

router.get("/getPostsFollowed/:userId", postController.getPostsFollowed);



module.exports = router;