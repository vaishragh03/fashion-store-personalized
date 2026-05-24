const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  createOrder,
  getOrders,
  getOrderById,
  downloadInvoice
} = require('../controllers/orderController');

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/', protect, getOrders);
router.get('/:id/invoice', protect, downloadInvoice);
router.get('/:id', protect, getOrderById);

module.exports = router;
