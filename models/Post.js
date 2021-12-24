const mongoose = require("mongoose");
import User from "./User";
import Comment from "./Comment";
var PostSchema = new mongoose.Schema({
  user: { User },
  likes: [User],
  comments: [Comment],
  caption: { type: String, required: true },
  image: { type: String },
});
module.exports = mongoose.model("Post", PostSchema);
