const slugify = require("slugify");

const slugifyTitle = (val, { req }) => {
  req.body.slug = slugify(val);
  return true;
};

module.exports = slugifyTitle;
