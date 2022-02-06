const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var PostSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  caption: { type: String, required: true },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Post", PostSchema);
