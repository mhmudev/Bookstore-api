const express = require("express");
require("dotenv").config();
const path = require("path");
const booksRouter = require("./routes/books");
const categoriesRouter = require("./routes/categories");
const authorsRouter = require("./routes/authors");
const usersRouter = require("./routes/users");
const errorHandler = require("./middleware/errorHandler");
const connectToDb = require("./utils/dbConnect");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

app.use("/api/v1/books", booksRouter);
app.use("/api/v1/categories", categoriesRouter);
app.use("/api/v1/authors", authorsRouter);
app.use("/api/v1/users", usersRouter);

app.use(errorHandler);

const start = async () => {
  try {
    await connectToDb(process.env.MONGO_URI);
    app.listen(process.env.PORT, console.log(`Server started....`));
  } catch (error) {
    console.log(error);
  }
};

start();
