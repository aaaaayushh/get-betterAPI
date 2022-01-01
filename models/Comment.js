const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var CommentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  comment: { type: String, required: true },
  post: { type: Schema.Types.ObjectId, ref: "Post" },
});
module.exports = mongoose.model("Comment", CommentSchema);
