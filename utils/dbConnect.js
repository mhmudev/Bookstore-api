const mongoose = require("mongoose");
const connectToDb = (uri) => mongoose.connect(uri);
module.exports = connectToDb;
