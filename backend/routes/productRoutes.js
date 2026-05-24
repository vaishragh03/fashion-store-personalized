const express = require('express');

const {
  getProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts
} = require('../controllers/productController');

const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

const router = express.Router();

// Public Routes
router.get('/', getProducts);
router.get('/admin/low-stock', protect, admin, getLowStockProducts);

router.get('/:id', getSingleProduct);

// Admin Routes
router.post('/', protect, admin, createProduct);

router.put('/:id', protect, admin, updateProduct);

router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;