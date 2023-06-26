const mongoose = require("mongoose");
const connectionString =
  process.env.MONGOOSE_URL ||
  "mongodb+srv://huutai:tai2k300@cluster0.xbemtzm.mongodb.net/?retryWrites=true&w=majority"; // Thay đổi chuỗi kết nối tới MongoDB của bạn

module.exports = function connectDb() {
  mongoose
    .connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
};
