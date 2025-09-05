import bcrypt from 'bcrypt';
import User from '../models/User.js';

export const listUsers = async (req, res) => {
  try {
    const { role, q, page = 1, limit = 20 } = req.query;
    const filter = { gym: req.user.gym };
    if (role) filter.role = role;
    if (q) filter.name = { $regex: q, $options: 'i' };
    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      User.find(filter).select('-password').skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
      User.countDocuments(filter)
    ]);
    res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ message: 'Failed to list users', error: err.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, gym: req.user.gym }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get user', error: err.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, managedBy } = req.body;
    const existing = await User.findOne({ email, gym: req.user.gym });
    if (existing) return res.status(400).json({ message: 'Email already exists' });
    const hashed = await bcrypt.hash(password, 10);
    const created = await User.create({
      name,
      email,
      password: hashed,
      role,
      gym: req.user.gym,
      createdBy: req.user._id,
      managedBy: managedBy || null
    });
    const obj = created.toObject();
    delete obj.password;
    res.status(201).json(obj);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create user', error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    const updated = await User.findOneAndUpdate(
      { _id: req.params.id, gym: req.user.gym },
      updates,
      { new: true }
    ).select('-password');
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user', error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const removed = await User.findOneAndDelete({ _id: req.params.id, gym: req.user.gym });
    if (!removed) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
};


