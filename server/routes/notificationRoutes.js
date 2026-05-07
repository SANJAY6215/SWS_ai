const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

const mongoose = require('mongoose');

// Get all notifications
router.get('/', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json([
      {
        _id: 'n1',
        message: 'System started in demo mode',
        type: 'info',
        read: false,
        timestamp: new Date()
      }
    ]);
  }
  try {
    const notifications = await Notification.find().sort({ timestamp: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mark notification as read
router.patch('/:id/read', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json({ _id: req.params.id, read: true });
  }
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id, 
      { read: true }, 
      { new: true }
    );
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mark all as read
router.patch('/read-all', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json({ message: 'All notifications marked as read (Mock)' });
  }
  try {
    await Notification.updateMany({ read: false }, { read: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
