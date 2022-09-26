const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
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
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
