const express = require('express');

const {
  getPersonalizedRecommendations
} = require('../controllers/recommendController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Protected Recommendation Route
router.get('/', protect, getPersonalizedRecommendations);

module.exports = router;