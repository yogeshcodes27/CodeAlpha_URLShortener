import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import urlRoutes from './routes/urlRoutes.js';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Body parser middleware to handle JSON payloads
app.use(express.json());

// MongoDB connection setup
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI || mongoURI.includes('<username>')) {
  console.log('\n========================================================================');
  console.log('⚠️  WARNING: MONGODB_URI is not configured yet.');
  console.log('Please update the .env file with your MongoDB Atlas connection string.');
  console.log('========================================================================\n');
} else {
  mongoose
    .connect(mongoURI)
    .then(() => console.log('✅ Connected to MongoDB Atlas successfully.'))
    .catch((error) => {
      console.error('❌ MongoDB Atlas connection error:');
      console.error(error.message);
    });
}

// Welcome route for simple API discovery
app.get('/', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  res.json({
    appName: 'CodeAlpha URL Shortener API',
    status: 'Running',
    version: '1.0.0',
    endpoints: [
      {
        method: 'POST',
        path: '/shorten',
        description: 'Shorten a long URL',
        bodyExample: { originalUrl: 'https://www.google.com' }
      },
      {
        method: 'GET',
        path: '/urls',
        description: 'Get all shortened URLs'
      },
      {
        method: 'GET',
        path: '/:shortCode',
        description: 'Redirect to original URL',
        example: `${baseUrl}/abc12345`
      }
    ]
  });
});

// Mount URL Routes under the root path
app.use('/', urlRoutes);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('💥 Unhandled Application Error:', err);
  return res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// Start listening for requests
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
  console.log(`👉 Access URL Shortener API at http://localhost:${PORT}`);
});
