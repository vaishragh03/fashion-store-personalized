const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

// Get user profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({
      success: true,
      user
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      user
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add address
router.post('/addresses', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.addresses.push(req.body);
    await user.save();

    res.status(201).json({
      success: true,
      addresses: user.addresses
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update address
router.put('/addresses/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const addrIndex = parseInt(req.params.id);
    user.addresses[addrIndex] = req.body;
    await user.save();

    res.json({
      success: true,
      addresses: user.addresses
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Track viewed category for recommendations
router.patch('/track-view', protect, async (req, res) => {
  try {
    const { category, tags } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (category && !user.recentlyViewedCategories.includes(category)) {
      user.recentlyViewedCategories.push(category);
      if (user.recentlyViewedCategories.length > 10) {
        user.recentlyViewedCategories = user.recentlyViewedCategories.slice(-10);
      }
    }

    if (tags && Array.isArray(tags)) {
      tags.forEach((tag) => {
        if (!user.interactedTags.includes(tag)) {
          user.interactedTags.push(tag);
        }
      });
    }

    await user.save();
    res.json({ success: true, recentlyViewedCategories: user.recentlyViewedCategories });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete address
router.delete('/addresses/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const addrIndex = parseInt(req.params.id);
    user.addresses.splice(addrIndex, 1);
    await user.save();

    res.json({
      success: true,
      addresses: user.addresses
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
