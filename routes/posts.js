const express = require("express");
const postController = require("../controllers/postController");
var router = express.Router();

//get all posts
router.get("/", postController.getPosts);
//create a post
router.post("/", postController.createPost);
module.exports = router;
