/* <----------------------- DEPENDENCIAS --------------------------> */
const express = require('express');

/* <----------------------- CONTROLADOR ---------------------------> */
const postController = require('../controllers/post.controller');

/* <------------------------ MIDDLEWARES ---------------------------> */
const authenticationMiddleware  = require("../middlewares/authentication.middleware.js");
const authorizationMiddleware  = require("../middlewares/authorization.middleware.js");

/* <------------------- ENRUTADOR TERCIARIO -----------------------> */
const router = express.Router();

router.post("/createPost", postController.createPost);
router.get("/getPosts", postController.getPosts);
router.get("/getPostByID/:id", postController.getPostByID);
router.get("/getUserPosts/:id", postController.getUserPosts);
router.put("/updatePost/:id", postController.updatePost);
router.delete("/deletePost/:id", postController.deletePost);

module.exports = router;
