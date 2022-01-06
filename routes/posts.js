const express = require("express");
const postController = require("../controllers/postController");
var router = express.Router();

//get all posts
router.get("/", postController.getPosts);
//upload image
router.post("/uploadImage", postController.imgUpload);
//create a post
router.post("/", postController.createPost);
router.post("/:postid/like", postController.likePost);
router.post("/:postid/unlike", postController.unlikePost);
module.exports = router;
