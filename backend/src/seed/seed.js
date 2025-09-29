import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Gym from '../models/Gym.js';
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
    Gym.deleteMany({}),
    User.deleteMany({}),
    ServicePackage.deleteMany({}),
    Equipment.deleteMany({}),
    Payment.deleteMany({}),
    Announcement.deleteMany({}),
    Todo.deleteMany({})
  ]);

  console.log('🏢 Creating gym...');
  const gym = await Gym.create({
    name: 'LidarFit Pro Gym',
    address: '123 Fitness Street, Gym City, GC 12345',
    phone: '+1-555-0100',
    email: 'info@lidarfit.com',
    description: 'Premium fitness center with state-of-the-art equipment',
    settings: {
      currency: 'USD',
      timezone: 'UTC',
      businessHours: {
        open: '06:00',
        close: '22:00'
      }
    }
  });

  console.log('👤 Creating users...');
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const staffPassword = await bcrypt.hash('Staff@123', 10);
  const customerPassword = await bcrypt.hash('Customer@123', 10);

  const admin = await User.create({ 
    name: 'Admin User', 
    email: 'admin@gym.com', 
    password: adminPassword, 
    role: 'admin' 
  });
  
  const staff = await User.create({ 
    name: 'Staff User', 
    email: 'staff@gym.com', 
    password: staffPassword, 
    role: 'staff', 
    createdBy: admin._id 
  });

  const customers = await User.insertMany([
    { 
      name: 'Alice Customer', 
      email: 'alice@gym.com', 
      password: customerPassword, 
      role: 'customer', 
      createdBy: admin._id, 
      managedBy: staff._id 
    },
    { 
      name: 'Bob Customer', 
      email: 'bob@gym.com', 
      password: customerPassword, 
      role: 'customer', 
      createdBy: admin._id, 
      managedBy: staff._id 
    },
    { 
      name: 'Charlie Customer', 
      email: 'charlie@gym.com', 
      password: customerPassword, 
      role: 'customer', 
      createdBy: admin._id, 
      managedBy: staff._id 
    }
  ]);

  console.log('📦 Creating service packages...');
  const [monthly, yearly, trial] = await ServicePackage.insertMany([
    { 
      gym: gym._id,
      name: 'Monthly Plan', 
      type: 'monthly', 
      price: 49.99,
      description: 'Perfect for regular gym-goers',
      benefits: ['Unlimited gym access', 'Free fitness assessment', 'Locker rental']
    },
    { 
      gym: gym._id,
      name: 'Yearly Plan', 
      type: 'yearly', 
      price: 499.0,
      description: 'Best value for committed members',
      benefits: ['Unlimited gym access', 'Free personal training session', 'Locker rental', '2 guest passes per month']
    },
    { 
      gym: gym._id,
      name: 'Trial Plan', 
      type: 'custom', 
      price: 0,
      description: '7-day free trial',
      benefits: ['Limited gym access', 'One-time fitness assessment']
    }
  ]);

  console.log('🛠️  Creating equipment...');
  await Equipment.insertMany([
    { 
      gym: gym._id,
      name: 'Treadmill', 
      vendor: 'FitVendor', 
      purchaseDate: new Date('2023-01-15'), 
      cost: 1200, 
      quantity: 5
    },
    { 
      gym: gym._id,
      name: 'Dumbbell Set', 
      vendor: 'IronCo', 
      purchaseDate: new Date('2023-03-10'), 
      cost: 300, 
      quantity: 20
    }
  ]);

  console.log('💳 Creating payments...');
  await Payment.insertMany([
    { 
      gym: gym._id,
      customer: customers[0]._id,
      staff: staff._id,
      package: monthly._id,
      amount: 49.99, 
      method: 'card', 
      status: 'completed', 
      transactionRef: 'TXN-001'
    },
    { 
      gym: gym._id,
      customer: customers[1]._id,
      staff: staff._id,
      package: yearly._id,
      amount: 499.0, 
      method: 'cash', 
      status: 'completed', 
      transactionRef: 'TXN-002'
    }
  ]);

  console.log('📢 Creating announcements...');
  await Announcement.insertMany([
    { 
      gym: gym._id,
      title: 'Welcome to LidarFit', 
      message: 'Grand opening promo! Sign up now and get 20% off your first month!', 
      audience: 'all', 
      createdBy: admin._id 
    },
    { 
      gym: gym._id,
      title: 'Staff Meeting', 
      message: 'Monthly sync-up this Friday at 3 PM', 
      audience: 'staff', 
      createdBy: admin._id 
    }
  ]);

  console.log('📝 Creating todos...');
  await Todo.insertMany([
    { 
      gym: gym._id,
      customer: customers[0]._id, 
      title: 'Attend Yoga Class', 
      status: 'pending', 
      assignedBy: staff._id 
    },
    { 
      gym: gym._id,
      customer: customers[1]._id, 
      title: 'Complete Body Assessment', 
      status: 'in_progress', 
      assignedBy: staff._id 
    }
  ]);

  console.log('\n✅ Seed completed successfully!');
  console.log('═══════════════════════════════════════════════════════');
  console.log('📋 Default Login Credentials:');
  console.log('───────────────────────────────────────────────────────');
  console.log('👨‍💼 Admin:');
  console.log('   Email: admin@gym.com');
  console.log('   Password: Admin@123');
  console.log('');
  console.log('👔 Staff:');
  console.log('   Email: staff@gym.com');
  console.log('   Password: Staff@123');
  console.log('');
  console.log('👤 Customers:');
  console.log('   Email: alice@gym.com   | Password: Customer@123');
  console.log('   Email: bob@gym.com     | Password: Customer@123');
  console.log('   Email: charlie@gym.com | Password: Customer@123');
  console.log('═══════════════════════════════════════════════════════\n');
  
  await mongoose.disconnect();
};

run().catch((e) => {
  console.error('❌ Seed failed:', e);
  process.exit(1);
});