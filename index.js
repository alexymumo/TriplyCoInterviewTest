// app.js
const express = require('express');
const app = express();

app.use(express.json());

// Example endpoint
app.get('/api/hello', (req, res) => {
  res.status(200).json({ message: 'Hello, world!' });
});

module.exports = app; // Export the app for Supertest
