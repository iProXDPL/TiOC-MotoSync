require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

// Connect to database
connectDB();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req, res) => {
  res.send('API MotoSync working!');
});

app.listen(port, () => {
  console.log(`Server MotoSync working on port ${port}`);
});