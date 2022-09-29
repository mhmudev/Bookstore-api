const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name field is required"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Email field is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password field is required"],
      minlength: [6, "Password length is too short"],
    },
    phone: String,
    image: String,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    resetCode: String,
    resetCodeExpiration: Date,
    isResetCodeVerified: Boolean,
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// UserSchema.pre("init", (doc) => {
//   const imageUrl = `${process.env.BASE_URL}/users/${doc.image}`;
//   doc.image = imageUrl;
// });

UserSchema.methods.createToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });

UserSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model("User", UserSchema);
