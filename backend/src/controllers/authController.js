// backend/src/controllers/authController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Gym from '../models/Gym.js';

// Generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Register user (non-gym flow)
export const register = async (req, res) => {
  try {
    const { name, email, password, role = 'customer' } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
      gym: req.body.gym || null,
      createdBy: req.user?._id || null
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const gym = user.gym ? await Gym.findById(user.gym) : null;
    const token = generateToken(user._id, user.role);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        gymId: user.gym,
        gymName: gym ? gym.name : null
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// Approve user (assign managedBy to current user)
export const approveUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.managedBy = req.user._id;
    await user.save();

    return res.json({
      message: 'User approved',
      user: { id: user._id, role: user.role, managedBy: user.managedBy }
    });
  } catch (err) {
    return res.status(500).json({ message: 'Approval failed', error: err.message });
  }
};

// Register gym + admin
export const registerGym = async (req, res) => {
  try {
    const { gymName, gymEmail, phone, address, adminEmail, adminPassword, adminFirstName, adminLastName } = req.body;

    const existingGym = await Gym.findOne({ email: gymEmail });
    if (existingGym) return res.status(400).json({ message: 'Gym already exists' });

    const gym = new Gym({
      name: gymName,
      email: gymEmail,
      phone,
      address,
      status: 'trial',
      createdAt: new Date()
    });
    await gym.save();

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const adminUser = new User({
      gym: gym._id,
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      name: `${adminFirstName} ${adminLastName}`,
      createdAt: new Date()
    });
    await adminUser.save();

    const token = generateToken(adminUser._id, adminUser.role);

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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Stats
export const getStats = async (req, res) => {
  try {
    const totalGyms = await Gym.countDocuments();
    const totalUsers = await User.countDocuments();

    res.json({ message: 'Auth stats working!', totalGyms, totalUsers, mockData: false });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
