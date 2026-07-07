/**
 * Run with:  npm run seed          -> inserts sample admin, customer & products
 *            npm run seed:destroy  -> wipes users, products & orders
 */
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'Jane Customer',
    email: 'customer@example.com',
    password: 'customer123',
    role: 'customer',
  },
];

const products = [
  {
    name: 'Wireless Noise-Cancelling Headphones',
    description:
      'Over-ear Bluetooth headphones with active noise cancellation, 30-hour battery life and plush memory-foam ear cups.',
    price: 129.99,
    discountPrice: 99.99,
    category: 'Electronics',
    brand: 'SoundCore',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'],
    countInStock: 25,
    isFeatured: true,
  },
  {
    name: 'Smart Fitness Watch',
    description:
      'Track heart rate, sleep, and workouts with this lightweight smart watch featuring a 10-day battery and water resistance.',
    price: 89.5,
    category: 'Electronics',
    brand: 'PulseFit',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'],
    countInStock: 40,
    isFeatured: true,
  },
  {
    name: "Men's Classic Leather Jacket",
    description: 'Genuine leather jacket with a timeless biker cut, quilted lining and YKK zippers.',
    price: 149.0,
    category: 'Fashion',
    brand: 'Urbanwear',
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600'],
    countInStock: 15,
  },
  {
    name: "Women's Running Sneakers",
    description: 'Breathable knit sneakers with responsive cushioning, designed for daily runs and the gym.',
    price: 74.99,
    category: 'Fashion',
    brand: 'StrideFlex',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'],
    countInStock: 60,
    isFeatured: true,
  },
  {
    name: 'Stainless Steel French Press',
    description: '34oz double-walled French press that keeps coffee hot for longer, with a fine mesh filter.',
    price: 32.99,
    category: 'Home & Kitchen',
    brand: 'BrewCraft',
    images: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600'],
    countInStock: 50,
  },
  {
    name: 'Ergonomic Office Chair',
    description: 'Adjustable mesh-back office chair with lumbar support and breathable fabric for all-day comfort.',
    price: 189.0,
    category: 'Home & Kitchen',
    brand: 'ComfortDesk',
    images: ['https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=600'],
    countInStock: 18,
  },
  {
    name: 'Programming Fundamentals Book Set',
    description: 'A 3-book bundle covering data structures, algorithms and full stack web development.',
    price: 54.99,
    category: 'Books',
    brand: 'TechPress',
    images: ['https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600'],
    countInStock: 35,
  },
  {
    name: 'Organic Skincare Gift Set',
    description: 'A 5-piece skincare set made with organic, cruelty-free ingredients for all skin types.',
    price: 45.0,
    category: 'Beauty',
    brand: 'PureGlow',
    images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600'],
    countInStock: 28,
    isFeatured: true,
  },
];

const importData = async () => {
  await connectDB();
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.create(users);
    const adminUser = createdUsers[0]._id;

    const sampleProducts = products.map((p) => ({ ...p, createdBy: adminUser }));
    await Product.create(sampleProducts);

    console.log('✅  Sample data imported successfully!');
    console.log('    Admin login:    admin@example.com / admin123');
    console.log('    Customer login: customer@example.com / customer123');
    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  await connectDB();
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    console.log('🗑️   Data destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
