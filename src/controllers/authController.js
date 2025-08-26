import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Gym from '../models/Gym.js';
import User from '../models/User.js';

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '30d' });
};

// Register new gym with hashed password and MongoDB
export const registerGym = async (req, res) => {
  try {
    const {
      gymName,
      gymEmail,
      phone,
      address,
      adminEmail,
      adminPassword,
      adminFirstName,
      adminLastName
    } = req.body;

    // Check if gym exists by email
    const existingGym = await Gym.findOne({ email: gymEmail });
    if (existingGym) {
      return res.status(400).json({ message: 'Gym already exists' });
    }

    // Create gym (including phone & address)
    const gym = new Gym({
      name: gymName,
      email: gymEmail,
      phone,
      address,
      status: 'trial',
      createdAt: new Date()
    });
    await gym.save();

    // Hash admin password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

    // Create admin user linked to gym
    const adminUser = new User({
      gym: gym._id,               // matches your schema field name
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',              // use a valid enum value from your schema
      name: `${adminFirstName} ${adminLastName}`, // required field
      createdAt: new Date()
    });
    await adminUser.save();

    const token = generateToken(adminUser._id);

    res.status(201).json({
      message: 'Gym and admin created successfully',
      token,
      user: {
        id: adminUser._id,
        email: adminUser.email,
        role: adminUser.role,
        gymId: gym._id,
        gymName: gym.name
      }
    });
  } catch (error) {
    console.error('Register gym error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login with email and password, compare hashed password
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Find gym for user
    const gym = await Gym.findById(user.gym);

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        gymId: user.gym,
        gymName: gym ? gym.name : null
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get stats - total gyms and users count from DB
export const getStats = async (req, res) => {
  try {
    const totalGyms = await Gym.countDocuments();
    const totalUsers = await User.countDocuments();

    res.json({
      message: 'Auth stats working!',
      totalGyms,
      totalUsers,
      mockData: false
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
