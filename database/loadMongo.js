require("dotenv").config();
const mongoose = require("mongoose");
const mongoPath = process.env.mongoPath;

const connectMongo = async () => {
  await mongoose.connect(mongoPath);
  return mongoose;
};

module.exports = async () => {
  await connectMongo()
    .then((mongoose) => {
      console.log("> Connected to Mongo Database");
    })
    .catch((err) => {
      console.log(err);
    });
};
