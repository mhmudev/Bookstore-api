const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      minlength: [3, "Title length is too short"],
      maxlength: [200, "Title length is too long"],
      required: [true, "Title field is required"],
      trim: true,
    },
    description: {
      type: String,
      minlength: [20, "Description length is too short"],
      maxlength: [500, "Description length is too long"],
      required: [true, "Description field is required"],
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    price: {
      type: Number,
      min: 20,
      max: 100000,
    },
    priceAfterDiscount: {
      type: Number,
    },
    sold: {
      type: Number,
      default: 0,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity field is required"],
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above or equal 1.0"],
      max: [5, "Rating must be below or equal 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: "Author",
      //   required: [true, "Book must belong to author"],
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: [true, "Book must belong to category"],
    },
    coverImage: {
      type: String,
      required: [true, "coverImage field is required"],
    },
    images: [String],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

BookSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "book",
  localField: "_id",
});

BookSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category author",
    select: "name image -_id",
  });
  next();
});

const addImageUrl = (doc) => {
  if (doc.coverImage) {
    doc.coverImage = `${process.env.BASE_URL}/books/${doc.coverImage}`;
  }
  if (doc.images) {
    const imagesUrl = [];
    doc.images.forEach((image) => {
      imagesUrl.push(`${process.env.BASE_URL}/books/${image}`);
    });
    doc.images = imagesUrl;
  }
};

// findOne, findAll, update => initialize before return a response
BookSchema.pre("init", (doc) => {
  addImageUrl(doc);
});

// for create
BookSchema.post("save", (doc) => {
  addImageUrl(doc);
});

module.exports = mongoose.model("Book", BookSchema);
