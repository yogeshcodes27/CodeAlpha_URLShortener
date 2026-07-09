import mongoose from 'mongoose';

// Define the Schema for URLs
const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: [true, 'Original URL is required'],
    trim: true,
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Create and export the Model
const Url = mongoose.model('Url', urlSchema);

export default Url;
