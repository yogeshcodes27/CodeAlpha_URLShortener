import express from 'express';
import { nanoid } from 'nanoid';
import Url from '../models/Url.js';

const router = express.Router();

/**
 * Helper function to validate if a string is a valid HTTP/HTTPS URL.
 * Native URL constructor handles standard URL parsing reliably.
 */
const isValidUrl = (urlString) => {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (e) {
    return false;
  }
};

/**
 * @route   POST /shorten
 * @desc    Shorten a long URL and store it in database
 * @access  Public
 */
router.post('/shorten', async (req, res, next) => {
  try {
    const { originalUrl } = req.body;

    // Validate request body
    if (!originalUrl) {
      return res.status(400).json({ error: 'Please provide an originalUrl in the request body.' });
    }

    // Validate URL format
    if (!isValidUrl(originalUrl)) {
      return res.status(400).json({
        error: 'Invalid URL format. The URL must be absolute and start with http:// or https://'
      });
    }

    // Generate a unique 8-character short code using nanoid
    const shortCode = nanoid(8);

    // Create and save the new URL document
    const newUrl = new Url({
      originalUrl,
      shortCode,
    });
    await newUrl.save();

    // Construct the full shortened URL dynamically
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const shortenedUrl = `${baseUrl}/${shortCode}`;

    return res.status(201).json({
      message: 'URL shortened successfully!',
      originalUrl,
      shortCode,
      shortenedUrl,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /urls
 * @desc    Get list of all stored URLs
 * @access  Public
 */
router.get('/urls', async (req, res, next) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 });

    // Format results to dynamically include the full shortened URL path
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const formattedUrls = urls.map(url => ({
      id: url._id,
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      shortenedUrl: `${baseUrl}/${url.shortCode}`,
      createdAt: url.createdAt,
    }));

    return res.json(formattedUrls);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /:shortCode
 * @desc    Redirect to the original URL associated with the short code
 * @access  Public
 */
router.get('/:shortCode', async (req, res, next) => {
  try {
    const { shortCode } = req.params;

    // Search for the URL record by its unique shortCode
    const urlRecord = await Url.findOne({ shortCode });

    if (!urlRecord) {
      return res.status(404).json({ error: 'Shortened URL not found.' });
    }

    // Perform a 302 redirect to the original long URL
    return res.redirect(urlRecord.originalUrl);
  } catch (error) {
    next(error);
  }
});

export default router;
