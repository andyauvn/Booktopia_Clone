// server.js 

import 'dotenv/config'; // Loads environment variables
import express from 'express';
import mongoose from 'mongoose';

const app = express();

const PORT = process.env.PORT || 8001;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(express.json());

// Route
app.get('/', (req, res) => {
  res.send('Booktopia Backend API is running!');
});

// Server Start Function
const startServer = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connection established successfully.');

    // Start the Server ONLY after DB connection is successful
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    // Catch any errors during the connection attempt or server start
    console.error('SERVER STARTUP ERROR:', error.message);
    process.exit(1); // Exit process if startup fails
  }
};

// 4. Execute the startup function
startServer();