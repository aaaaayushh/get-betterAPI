const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var MessageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: "User" },
  receiver: { type: Schema.Types.ObjectId, ref: "User" },
  body: { type: String, required: true },
});
module.exports = mongoose.model("Message", MessageSchema);
