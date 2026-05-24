const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },

  title: {
    type: String,
    required: true
  },

  quantity: {
    type: Number,
    required: true,
    min: 1
  },

  size: {
    type: String,
    required: true
  },

  color: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  }
});

const shippingAddressSchema = new mongoose.Schema({
  streetAddress: {
    type: String,
    required: true
  },

  city: {
    type: String,
    required: true
  },

  state: {
    type: String,
    required: true
  },

  postalCode: {
    type: String,
    required: true
  },

  country: {
    type: String,
    default: 'India'
  }
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    items: [orderItemSchema],

    shippingAddress: shippingAddressSchema,

    paymentMethod: {
      type: String,
      default: 'Mock Payment'
    },

    subtotal: {
      type: Number,
      required: true,
      default: 0
    },

    shippingPrice: {
      type: Number,
      required: true,
      default: 0
    },

    discount: {
      type: Number,
      default: 0
    },

    totalPrice: {
      type: Number,
      required: true,
      default: 0
    },

    couponCode: {
      type: String
    },

    orderStatus: {
      type: String,
      enum: [
        'Pending',
        'Confirmed',
        'Shipped',
        'Delivered'
      ],
      default: 'Pending'
    },

    isPaid: {
      type: Boolean,
      default: false
    },

    paidAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Order', orderSchema);