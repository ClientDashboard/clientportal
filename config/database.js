// config/database.js
require('dotenv').config();
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("⚠️ ERROR: MONGO_URI is missing from .env file!");
    }

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Conexión exitosa a MongoDB (Mongoose)");
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:");
    
    // Check for common connection issues
    if (error.message.includes("failed to connect to server")) {
      console.error("🚨 Check if MongoDB is running or the connection string is correct.");
    } else if (error.message.includes("authentication failed")) {
      console.error("🚨 Check your MongoDB username and password in .env.");
    } else {
      console.error(error.message);
    }

    process.exit(1);
  }
};

module.exports = connectDB;
