const mongoose = require("mongoose");
const User = require("./User");
const Post = require("./Post");
var CommentSchema = new mongoose.Schema({
  user: { User },
  comment: { type: String, required: true },
  post: { Post },
});
