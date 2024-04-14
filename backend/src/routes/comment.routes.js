/* <----------------------- DEPENDENCIAS --------------------------> */
const express = require('express');

/* <----------------------- CONTROLADOR ---------------------------> */
const commentController = require('../controllers/comment.controller');

/* <------------------- ENRUTADOR TERCIARIO -----------------------> */
const router = express.Router();

router.post("/createComment", commentController.createComment);
router.get("/getComments", commentController.getComments);
router.get("/getComment/:id", commentController.getComment);
router.put("/updateComment/:id", commentController.updateComment);
router.delete("/deleteComment/:id", commentController.deleteComment);
router.get("/getCommentsByUser/:id", commentController.getCommentsByUser);
router.put("/editComment/:id", commentController.editComment);

module.exports = router;