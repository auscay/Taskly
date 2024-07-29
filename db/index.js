const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const MONGODB_URL = process.env.MONGODB_URL

async function connectToMongoDB() {
    try {
      await mongoose.connect(MONGODB_URL);
      console.log("Connection to MongoDB Successful");
    } catch (err) {
      console.log(err);
      console.log("An error occurred");
    }
  
    mongoose.connection.on("error", (err) => {
      console.log(err);
      console.log("An error occurred");
    });
  }

module.exports = { connectToMongoDB }
