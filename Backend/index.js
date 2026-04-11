require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const { clerkMiddleware } = require('@clerk/express')

// Connect to database
connectDB();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware())

// Routes
const carRoutes = require('./routes/carRoutes');
const reportRoutes = require('./routes/reportRoutes');

// Basic route
app.get('/', (req, res) => {
  res.send('API MotoSync working!');
});

app.use('/api/cars', carRoutes);
app.use('/api/reports', reportRoutes);

app.listen(port, () => {
  console.log(`Server MotoSync working on port ${port}`);
});