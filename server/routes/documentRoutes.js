const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const Document = require('../models/Document');
const Notification = require('../models/Notification');

// In-memory store for Demo Mode
let mockDocuments = [
  {
    _id: '1',
    name: 'SWS-AI-company-overview.pdf',
    size: 8087,
    type: 'application/pdf',
    path: 'uploads/mock-overview.pdf',
    uploadDate: new Date().toISOString(),
    status: 'complete'
  }
];

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
  // Check if MongoDB is connected
  if (mongoose.connection.readyState !== 1) {
    console.warn('MongoDB not connected. Returning in-memory mock data.');
    return res.json(mockDocuments);
  }

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

  // Check if MongoDB is connected
  if (mongoose.connection.readyState !== 1) {
    console.warn('MongoDB not connected. Adding to in-memory mock store.');
    const newMockDocs = files.map(file => ({
      _id: 'mock-' + Math.random().toString(36).substr(2, 9),
      name: file.originalname,
      size: file.size,
      type: file.mimetype,
      path: file.path,
      uploadDate: new Date().toISOString(),
      status: 'complete'
    }));
    mockDocuments = [...newMockDocs, ...mockDocuments];
    return res.status(201).json(newMockDocs);
  }

  try {
    const savedDocs = [];
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
