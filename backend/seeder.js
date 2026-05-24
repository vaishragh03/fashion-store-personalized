const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');

dotenv.config();

const products = [
  {
    title: 'Classic Leather Sneakers',
    description: 'Comfortable everyday sneakers with premium leather upper.',
    basePrice: 2499,
    category: 'Footwear',
    tags: ['casual', 'sneakers', 'leather'],
    images: ['https://picsum.photos/seed/fashion-sneakers/400/500'],
    variants: [
      { size: 'M', colorName: 'White', colorHex: '#FFFFFF', stock: 12, additionalPrice: 0 },
      { size: 'L', colorName: 'Black', colorHex: '#000000', stock: 3, additionalPrice: 200 }
    ]
  },
  {
    title: 'Running Sport Shoes',
    description: 'Lightweight running shoes built for performance.',
    basePrice: 3199,
    category: 'Footwear',
    tags: ['sports', 'running'],
    images: ['https://picsum.photos/seed/fashion-running/400/500'],
    variants: [
      { size: 'M', colorName: 'Blue', colorHex: '#2563eb', stock: 8, additionalPrice: 0 },
      { size: 'L', colorName: 'Red', colorHex: '#dc2626', stock: 4, additionalPrice: 0 }
    ]
  },
  {
    title: 'Formal Oxford Shoes',
    description: 'Elegant oxford shoes for office and events.',
    basePrice: 3999,
    category: 'Footwear',
    tags: ['formal', 'office'],
    images: ['https://picsum.photos/seed/fashion-oxford/400/500'],
    variants: [
      { size: 'M', colorName: 'Brown', colorHex: '#78350f', stock: 2, additionalPrice: 0 },
      { size: 'L', colorName: 'Black', colorHex: '#000000', stock: 5, additionalPrice: 0 }
    ]
  },
  {
    title: 'Slim Fit Cotton Shirt',
    description: 'Breathable cotton shirt with modern slim fit.',
    basePrice: 1299,
    category: 'Men',
    tags: ['shirt', 'cotton', 'formal'],
    images: ['https://picsum.photos/seed/fashion-shirt/400/500'],
    variants: [
      { size: 'M', colorName: 'White', colorHex: '#FFFFFF', stock: 15, additionalPrice: 0 },
      { size: 'L', colorName: 'Navy', colorHex: '#1e3a8a', stock: 10, additionalPrice: 0 }
    ]
  },
  {
    title: 'Denim Jacket',
    description: 'Classic denim jacket for all seasons.',
    basePrice: 2199,
    category: 'Men',
    tags: ['jacket', 'denim'],
    images: ['https://picsum.photos/seed/fashion-denim/400/500'],
    variants: [
      { size: 'M', colorName: 'Blue', colorHex: '#3b82f6', stock: 6, additionalPrice: 0 },
      { size: 'XL', colorName: 'Black', colorHex: '#000000', stock: 4, additionalPrice: 300 }
    ]
  },
  {
    title: 'Floral Summer Dress',
    description: 'Light floral dress perfect for summer outings.',
    basePrice: 1899,
    category: 'Women',
    tags: ['dress', 'summer', 'floral'],
    images: ['https://picsum.photos/seed/fashion-dress/400/500'],
    variants: [
      { size: 'S', colorName: 'Pink', colorHex: '#f472b6', stock: 9, additionalPrice: 0 },
      { size: 'M', colorName: 'Yellow', colorHex: '#facc15', stock: 7, additionalPrice: 0 }
    ]
  },
  {
    title: 'Elegant Silk Blouse',
    description: 'Premium silk blouse for evening wear.',
    basePrice: 2499,
    category: 'Women',
    tags: ['blouse', 'silk', 'elegant'],
    images: ['https://picsum.photos/seed/fashion-blouse/400/500'],
    variants: [
      { size: 'S', colorName: 'Cream', colorHex: '#fef3c7', stock: 5, additionalPrice: 0 },
      { size: 'M', colorName: 'Maroon', colorHex: '#881337', stock: 3, additionalPrice: 500 }
    ]
  },
  {
    title: 'Leather Handbag',
    description: 'Stylish leather handbag with multiple compartments.',
    basePrice: 2999,
    category: 'Accessories',
    tags: ['bag', 'leather'],
    images: ['https://picsum.photos/seed/fashion-handbag/400/500'],
    variants: [
      { size: 'Free Size', colorName: 'Tan', colorHex: '#d97706', stock: 8, additionalPrice: 0 },
      { size: 'Free Size', colorName: 'Black', colorHex: '#000000', stock: 6, additionalPrice: 0 }
    ]
  },
  {
    title: 'Aviator Sunglasses',
    description: 'UV-protected aviator sunglasses with metal frame.',
    basePrice: 999,
    category: 'Accessories',
    tags: ['sunglasses', 'summer'],
    images: ['https://picsum.photos/seed/fashion-sunglasses/400/500'],
    variants: [
      { size: 'Free Size', colorName: 'Gold', colorHex: '#ca8a04', stock: 20, additionalPrice: 0 },
      { size: 'Free Size', colorName: 'Silver', colorHex: '#9ca3af', stock: 2, additionalPrice: 0 }
    ]
  }
];

const seed = async () => {
  try {
    await connectDB();

    await Product.deleteMany();
    await User.deleteMany({ email: { $in: ['admin@fashion.com', 'customer@fashion.com'] } });

    await Product.insertMany(products);

    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const customerPassword = await bcrypt.hash('customer123', salt);

    await User.create([
      {
        name: 'Admin User',
        email: 'admin@fashion.com',
        password: adminPassword,
        role: 'admin'
      },
      {
        name: 'Demo Customer',
        email: 'customer@fashion.com',
        password: customerPassword,
        role: 'customer'
      }
    ]);

    console.log('✅ Database seeded successfully!');
    console.log('Admin: admin@fashion.com / admin123');
    console.log('Customer: customer@fashion.com / customer123');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();
