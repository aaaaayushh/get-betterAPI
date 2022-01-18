const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var MessageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: "User" },
  receiver: { type: Schema.Types.ObjectId, ref: "User" },
  body: { type: String, required: true },
  created: { type: Date, default: new Date() },
});
module.exports = mongoose.model("Message", MessageSchema);
