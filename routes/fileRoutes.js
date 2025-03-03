const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware'); // Fixed path
const multer = require('multer');
const path = require('path');
const File = require('../models/File'); // Fixed path

// Configure multer storage to save files in 'public/uploads'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Upload endpoint (protected)
router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const newFile = await File.create({
      owner: req.user.id,
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
    });
    
    res.status(201).json({ message: 'File uploaded successfully', file: newFile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List files endpoint (protected)
router.get('/list', authMiddleware, async (req, res) => {
  try {
    const files = await File.find({ owner: req.user.id });
    res.json({ files });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Download endpoint (protected)
router.get('/download/:filename', authMiddleware, (req, res) => {
  const filename = decodeURIComponent(req.params.filename);
  const filePath = path.join(__dirname, '../public/uploads', filename); // Fixed path
  res.download(filePath, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error downloading file' });
    }
  });
});

module.exports = router;
