const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  label: {
    type: String,
    enum: ['Home', 'Work', 'Other'],
    default: 'Home'
  },

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

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User name is required']
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: [true, 'Password is required']
    },

    role: {
      type: String,
      enum: ['admin', 'customer'],
      default: 'customer'
    },

    addresses: [addressSchema],

    recentlyViewedCategories: [
      {
        type: String
      } 
    ],

    interactedTags: [
      {
        type: String
      }
    ],

    purchasedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);