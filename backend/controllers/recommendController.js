// backend/controllers/recommendController.js
const Product = require('../models/Product');
const User = require('../models/User');

/**
 * @desc    Get personalized product recommendations
 * @route   GET /api/recommendations
 * @access  Private
 */
exports.getPersonalizedRecommendations = async (req, res) => {
  try {
    // 1. Fetch user data with purchase history and recently viewed categories
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User profile not found." });
    }

    const { targetCategories, preferredTags } = getBehavioralInsights(user);

    // 2. Query matching products from our database
    const recommendations = await Product.find({
      $or: [
        { category: { $in: targetCategories } },
        { tags: { $in: preferredTags } }
      ],
      // Exclude products the user has already bought to keep suggestions fresh
      _id: { $nin: user.purchasedProducts || [] }
    })
    .limit(8)
    .lean();

    // 3. Fallback: If there are not enough behavioral recommendations, suggest top-rated items
    if (recommendations.length < 4) {
      const remainingSlots = 8 - recommendations.length;
      const genericTopRated = await Product.find({
        _id: { $nin: [...(user.purchasedProducts || []), ...recommendations.map(p => p._id)] }
      })
      .sort({ 'ratings.average': -1 })
      .limit(remainingSlots)
      .lean();

      recommendations.push(...genericTopRated);
    }

    res.status(200).json({
      success: true,
      count: recommendations.length,
      data: recommendations
    });
  } catch (error) {
    console.error("Personalization Engine Error:", error.message);
    res.status(500).json({ message: "Error compiling recommendation metrics." });
  }
};

/**
 * Extract behavioral preferences from user logs
 */
function getBehavioralInsights(user) {
  const targetCategories = [...new Set(user.recentlyViewedCategories || [])];
  const preferredTags = [...new Set(user.interactedTags || [])];

  // Default fallbacks if user behavior data is empty
  if (targetCategories.length === 0) {
    targetCategories.push('Women', 'Men');
  }

  return { targetCategories, preferredTags };
}