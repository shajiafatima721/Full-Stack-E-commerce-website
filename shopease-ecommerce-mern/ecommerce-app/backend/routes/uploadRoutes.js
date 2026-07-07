const express = require('express');
const upload = require('../middleware/uploadMiddleware');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @desc    Upload one or more product images
 * @route   POST /api/upload
 * @access  Private/Admin
 */
router.post('/', protect, admin, upload.array('images', 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('Please select at least one image to upload');
  }

  const paths = req.files.map((file) => `/uploads/${file.filename}`);
  res.status(201).json({ success: true, images: paths });
});

module.exports = router;
