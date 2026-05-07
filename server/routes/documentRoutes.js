const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Document = require('../models/Document');
const Notification = require('../models/Notification');

// Configure Multer for PDF storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// Get all documents
router.get('/', async (req, res) => {
  try {
    const docs = await Document.find().sort({ uploadDate: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Upload single/multiple files
router.post('/upload', upload.array('files'), async (req, res) => {
  const io = req.app.get('io');
  const files = req.files;
  
  if (!files || files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }

  try {
    const savedDocs = [];
    
    // If more than 3 files, handle as "Bulk" (this is a logic hint for frontend)
    const isBulk = files.length > 3;

    for (const file of files) {
      const newDoc = new Document({
        name: file.originalname,
        size: file.size,
        type: file.mimetype,
        path: file.path,
        status: 'complete'
      });
      const savedDoc = await newDoc.save();
      savedDocs.push(savedDoc);
    }

    // Create Notification for bulk upload if needed
    if (isBulk) {
      const notification = new Notification({
        message: `${files.length} files uploaded successfully`,
        type: 'success'
      });
      await notification.save();
      io.emit('new-notification', notification);
    }

    res.status(201).json(savedDocs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
