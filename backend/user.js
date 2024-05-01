const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  verification: Number,
  email: String,
  password: String,
  userverify: { type: Boolean, default: false },
  isLogin: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
