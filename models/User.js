const mongoose = require("mongoose");
const bcyrpt = require("bcryptjs");

var UserSchema = new mongoose.Schema({
  username: { type: String, required: true, maxLength: 100, unique: true },
  password: { type: String, maxLength: 100 },
  firstname: { type: String, maxLength: 100 },
  lastname: { type: String, maxLength: 100 },
  googleId: { type: String },
  profilePic: { type: String },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

UserSchema.pre("save", async function (next) {
  const user = this;
  if (this.password) {
    const hash = await bcyrpt.hash(this.password, 10);
    this.password = hash;
  }
  next();
});
UserSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcyrpt.compare(password, user.password);
  return compare;
};
module.exports = mongoose.model("User", UserSchema);
