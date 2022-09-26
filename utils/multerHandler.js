const multer = require("multer");
const sharp = require("sharp");
const APIError = require("./APIError");

const memoryStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new APIError("Images only allowed"), false);
  }
};

const resizeCategoryImage = async (req, res, next) => {
  try {
    const imageFileName = `category-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/categories/${imageFileName}`);

    // Save image into our db
    req.body.image = imageFileName;
    next();
  } catch (error) {
    next(error);
  }
};

const resize = async (req, res, next) => {
  if (req.files.coverImage) {
    const coverImageFileName = `book-${Date.now()}-cover.jpeg`;

    await sharp(req.files.coverImage[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/books/${coverImageFileName}`);

    // Save image into our db
    req.body.coverImage = coverImageFileName;
  }
  //2- Image processing for images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `book-${Date.now()}-${index + 1}.jpeg`;

        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/books/${imageName}`);

        // Save image into our db
        req.body.images.push(imageName);
      })
    );
    next();
  }
};

const upload = multer({ storage: memoryStorage, fileFilter: multerFilter });

module.exports = {
  resize,
  resizeCategoryImage,
  upload,
};
