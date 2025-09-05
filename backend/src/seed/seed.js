import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import ServicePackage from '../models/ServicePackage.js';
import Equipment from '../models/Equipment.js';
import Payment from '../models/Payment.js';
import Announcement from '../models/Announcement.js';
import Todo from '../models/Todo.js';

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lidarfit';

const run = async () => {
  await mongoose.connect(mongoURI);

  console.log('🧹 Clearing existing data...');
  await Promise.all([
    User.deleteMany({}),
    ServicePackage.deleteMany({}),
    Equipment.deleteMany({}),
    Payment.deleteMany({}),
    Announcement.deleteMany({}),
    Todo.deleteMany({})
  ]);

  console.log('👤 Creating users...');
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const staffPassword = await bcrypt.hash('Staff@123', 10);
  const customerPassword = await bcrypt.hash('Customer@123', 10);

  const admin = await User.create({ name: 'Admin User', email: 'admin@gym.com', password: adminPassword, role: 'admin' });
  const staff = await User.create({ name: 'Staff User', email: 'staff@gym.com', password: staffPassword, role: 'staff', createdBy: admin._id });

  const customers = await User.insertMany([
    { name: 'Alice Customer', email: 'alice@gym.com', password: customerPassword, role: 'customer', createdBy: admin._id, managedBy: staff._id },
    { name: 'Bob Customer', email: 'bob@gym.com', password: customerPassword, role: 'customer', createdBy: admin._id, managedBy: staff._id },
    { name: 'Charlie Customer', email: 'charlie@gym.com', password: customerPassword, role: 'customer', createdBy: admin._id, managedBy: staff._id }
  ]);

  console.log('📦 Creating service packages...');
  const [monthly, yearly, trial] = await ServicePackage.insertMany([
    { name: 'Monthly Plan', type: 'monthly', price: 49.99 },
    { name: 'Yearly Plan', type: 'yearly', price: 499.0 },
    { name: 'Trial Plan', type: 'custom', price: 0 }
  ]);

  console.log('🛠️  Creating equipment...');
  await Equipment.insertMany([
    { name: 'Treadmill', vendor: 'FitVendor', purchaseDate: new Date('2023-01-15'), cost: 1200, quantity: 5 },
    { name: 'Dumbbell Set', vendor: 'IronCo', purchaseDate: new Date('2023-03-10'), cost: 300, quantity: 20 }
  ]);

  console.log('💳 Creating payments...');
  await Payment.insertMany([
    { customer: customers[0]._id, amount: 49.99, method: 'card', status: 'completed', transactionRef: 'TXN-001' },
    { customer: customers[1]._id, amount: 499.0, method: 'cash', status: 'completed', transactionRef: 'TXN-002' }
  ]);

  console.log('📢 Creating announcements...');
  await Announcement.insertMany([
    { title: 'Welcome to LidarFit', message: 'Grand opening promo!', audience: 'all', createdBy: admin._id },
    { title: 'Staff Meeting', message: 'Monthly sync-up', audience: 'staff', createdBy: admin._id }
  ]);

  console.log('📝 Creating todos...');
  await Todo.insertMany([
    { customer: customers[0]._id, title: 'Attend Yoga Class', status: 'pending', assignedBy: staff._id },
    { customer: customers[1]._id, title: 'Complete Body Assessment', status: 'in_progress', assignedBy: staff._id }
  ]);

  console.log('✅ Seed completed.');
  await mongoose.disconnect();
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});


