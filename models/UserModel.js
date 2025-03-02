const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isLogin: { type: Boolean, default: false },
  userType: { type: String, enum: ["admin", "user"], default: "user" }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
