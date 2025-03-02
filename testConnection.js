// testConnection.js

const mongoose = require('mongoose');

// Replace with your actual connection string from MongoDB Atlas
const MONGO_URI = 'mongodb+srv://<username>:<password>@cluster0.xyz.mongodb.net/<dbName>?retryWrites=true&w=majority';

async function testConnection() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connection to MongoDB successful!');
  } catch (err) {
    console.error('❌ Connection failed:', err);
  } finally {
    // Close the connection after the test
    await mongoose.connection.close();
  }
}

testConnection();
