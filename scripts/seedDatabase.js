const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const seedUsers = [
  {
    name: 'Test User 1',
    email: 'test1@example.com',
    phone: '+1234567890',
    password: 'password123'
  },
  {
    name: 'Test User 2',
    email: 'test2@example.com',
    phone: '+1234567891',
    password: 'password123'
  },
  {
    name: 'Demo User',
    email: 'demo@example.com',
    phone: '+1234567892',
    password: 'demo123'
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Hash passwords and create users
    for (const userData of seedUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      await User.create({
        ...userData,
        password: hashedPassword
      });
      console.log(`Created user: ${userData.email}`);
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
