
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const variantSchema = new mongoose.Schema({
  size: {
    type: String,
    required: [true, "Size variant is required (e.g. S, M, L, XL)"],
    enum: {
      values: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'],
      message: '{VALUE} is not a supported apparel size.'
    }
  },
  colorName: {
    type: String,
    required: [true, "Please provide a human-readable color (e.g. Cobalt Blue)"]
  },
  colorHex: {
    type: String,
    required: [true, "Provide Hex value of variant color for UI rendering (e.g. #0047AB)"]
  },
  additionalPrice: {
    type: Number,
    default: 0,
    min: [0, "Additional pricing cannot be negative"]
  },
  stock: {
    type: Number,
    required: [true, "Specify inventory availability for this variant"],
    min: [0, "Stock cannot fall below zero"],
    default: 15
  }
});

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Product name is required"],
    trim: true
  },
  description: {
    type: String,
    required: [true, "Product summary details are required"]
  },
  basePrice: {
    type: Number,
    required: [true, "Base price tag is required"],
    min: [0.01, "Price must be greater than zero"]
  },
  category: {
    type: String,
    required: [true, "Category classification is required"],
    enum: ['Men', 'Women', 'Footwear', 'Accessories', 'Unisex']
  },
  tags: [{
    type: String,
    trim: true
  }],
  images: [{
    type: String,
    required: [true, "At least one product image is required"]
  }],
  variants: [variantSchema], // Embedded array of product variations
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  }
}, { timestamps: true });

// Pre-save validation: Ensure at least one product variant is defined
productSchema.pre('save', async function() {
  if (!this.variants || this.variants.length === 0) {
    throw new Error('A fashion product must have at least one variant configuration.');
  }
});


module.exports = mongoose.model('Product', productSchema);