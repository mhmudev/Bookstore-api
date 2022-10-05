const express = require("express");
const path = require("path");
require("dotenv").config();
var cookieParser = require("cookie-parser");
const cors = require("cors");
const compression = require("compression");
const session = require("express-session");

const errorHandler = require("./middleware/errorHandler");
const connectToDb = require("./utils/dbConnect");
const mountRoutes = require("./routes");

const app = express();
app.use(cors());
app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

const MongoStore = require("connect-mongo");
const sessionStore = MongoStore.create({ mongoUrl: process.env.MONGO_URI });
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: Number(process.env.MAX_AGE), // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
    },
  })
);

mountRoutes(app);
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
