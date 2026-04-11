const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String, required: true },
  profileImg: { type: String },
  role: { type: String, default: "user" },
  isVerified: { type: Boolean, default: false },
  status: { type: String, default: "active" },
  createdAt: { type: Date, default: Date.now },
  wishList: [{ type: mongoose.Types.ObjectId, ref: "Product" }],

  emailVerificationToken: { type: String },
  emailVerificationTokenExpiry: { type: String },
});

UserSchema.methods.comparePassword = (loginPassword, dbPassword) => {
  console.log(loginPassword, "user login password");

  return bcrypt.compare(loginPassword, dbPassword);
};

module.exports = mongoose.model("User", UserSchema);
