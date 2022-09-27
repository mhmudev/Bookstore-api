const mongoose = require("mongoose");

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
  },
  { timestamps: true }
);

// UserSchema.pre("init", (doc) => {
//   const imageUrl = `${process.env.BASE_URL}/users/${doc.image}`;
//   doc.image = imageUrl;
// });

module.exports = mongoose.model("User", UserSchema);
