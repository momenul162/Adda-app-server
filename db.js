const { default: mongoose } = require("mongoose");
const error = require("./utils/error");

const connectDB = async (url) => {
  try {
    await mongoose.connect(url);
  } catch (err) {
    throw error(err, 502);
  }
};

module.exports = connectDB;
