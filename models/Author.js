const mongoose = require("mongoose");

const AuthorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [3, "Name length is too short"],
      maxlength: [200, "Name length is too long"],
      trim: true,
      required: [true, "Name field is required"],
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    numOfBooks: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Author", AuthorSchema);
