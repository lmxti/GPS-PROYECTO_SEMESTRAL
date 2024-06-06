/* <----------------------- MODULOS --------------------------> */
const express = require('express');

/* <----------------------- CONTROLADOR ---------------------------> */
const commentController = require('../controllers/comment.controller');

/* <------------------------ MIDDLEWARES ---------------------------> */
const authenticationMiddleware  = require("../middlewares/authentication.middleware.js");
const authorizationMiddleware  = require("../middlewares/authorization.middleware.js");
const subirImagen = require("../middlewares/handleMulter.middleware.js");

/* <------------------- ENRUTADOR TERCIARIO -----------------------> */
const router = express.Router();

router.post("/createComment", [subirImagen.array('imageComment')],commentController.createComment);
router.get("/getComments", commentController.getComments);
router.get("/getComment/:id", commentController.getComment);
router.put("/updateComment/:id", commentController.updateComment);
router.delete("/deleteComment/:id", commentController.deleteComment);
router.get("/getCommentsByUser/:id", commentController.getCommentsByUser);
router.put("/editComment/:id", commentController.editComment);
router.get("/getCommentsByPost/:id", commentController.getCommentsByPost);

module.exports = router;