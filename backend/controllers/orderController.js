const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const { generateInvoice } = require('./invoiceController');
const { sendOrderConfirmationEmail } = require('../services/emailService');

const COUPONS = {
  FASHION10: 0.1,
  WELCOME20: 0.2
};

// Create order
exports.createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      couponCode,
      paymentMethod = 'Mock Payment'
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must have items' });
    }

    const subtotal = items.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    );
    const shippingPrice = subtotal > 999 ? 0 : 49;
    const discountRate = COUPONS[couponCode?.toUpperCase()] || 0;
    const discount = Math.round(subtotal * discountRate);
    const totalPrice = subtotal + shippingPrice - discount;

    const order = await Order.create({
      user: req.user.id,
      items,
      shippingAddress,
      subtotal,
      shippingPrice,
      discount,
      totalPrice,
      couponCode: couponCode || undefined,
      paymentMethod,
      orderStatus: 'Confirmed',
      isPaid: true,
      paidAt: new Date()
    });

    const user = await User.findById(req.user.id);
    if (user) {
      const productIds = items.map((i) => i.product).filter(Boolean);
      user.purchasedProducts = [
        ...new Set([
          ...(user.purchasedProducts || []).map(String),
          ...productIds.map(String)
        ])
      ];
      await user.save();
    }

    for (const item of items) {
      if (!item.product) continue;
      const product = await Product.findById(item.product);
      if (!product) continue;
      const variant = product.variants.find(
        (v) => v.size === item.size && v.colorName === item.color
      );
      if (variant && variant.stock >= (item.quantity || 1)) {
        variant.stock -= item.quantity || 1;
        await product.save();
      }
    }

    if (user?.email) {
      try {
        await sendOrderConfirmationEmail(user.email, {
          customerName: user.name,
          orderId: order._id,
          items: items.map((i) => ({
            title: i.title,
            variantSize: i.size,
            variantColor: i.color,
            quantity: i.quantity || 1,
            price: i.price * (i.quantity || 1)
          })),
          shippingPrice,
          totalPrice
        });
      } catch (emailErr) {
        console.error('Order email failed:', emailErr.message);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.downloadInvoice = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const pdfDoc = generateInvoice(order);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="invoice-${order._id}.pdf"`
    );
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
