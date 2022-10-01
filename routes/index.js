const booksRouter = require("./books");
const categoriesRouter = require("./categories");
const authorsRouter = require("./authors");
const usersRouter = require("./users");
const authRouter = require("./auth");
const reviewsRouter = require("./reviews");
const wishlistRouter = require("./wishlist");
const addressesRouter = require("./addresses");
const couponsRouter = require("./coupons");

const mountRoutes = (app) => {
  app.use("/api/v1/books", booksRouter);
  app.use("/api/v1/categories", categoriesRouter);
  app.use("/api/v1/authors", authorsRouter);
  app.use("/api/v1/users", usersRouter);
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/reviews", reviewsRouter);
  app.use("/api/v1/wishlist", wishlistRouter);
  app.use("/api/v1/addresses", addressesRouter);
  app.use("/api/v1/coupons", couponsRouter);
};

module.exports = mountRoutes;
