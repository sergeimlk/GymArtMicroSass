const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'GymArt API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      test: '/api/test'
    },
    timestamp: new Date().toISOString()
  });
});

app.get('/api/test', (req, res) => {
  res.status(200).json({
    ok: true,
    message: 'Express API is working!',
    timestamp: new Date().toISOString(),
    endpoint: '/api/test'
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 GymArt API server running on http://localhost:${port}`);
  console.log(`🔧 Test endpoint available at http://localhost:${port}/api/test`);
});
