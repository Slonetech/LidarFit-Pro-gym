const User = require('../models/User');
const Membership = require('../models/Membership');

// Get all users in gym
const getUsers = async (req, res) => {
  try {
    const { role, status, page = 1, limit = 10 } = req.query;
    const gymId = req.gymId;

    // Build filter
    let filter = { gymId };
    if (role) filter.role = role;
    if (status) filter.status = status;

    // Pagination
    const skip = (page - 1) * limit;

    const users = await User.find(filter)
      .select('-password')
      .populate('gymId', 'name')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single user
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const gymId = req.gymId;

    const user = await User.findOne({ _id: id, gymId })
      .select('-password')
      .populate('gymId', 'name');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's membership if they're a member
    let membership = null;
    if (user.role === 'member') {
      membership = await Membership.findOne({ 
        userId: id, 
        gymId,
        status: 'active' 
      });
    }

    res.json({ user, membership });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new user (trainer/admin)
const createUser = async (req, res) => {
  try {
    const { email, password, phone, firstName, lastName, role } = req.body;
    const gymId = req.gymId;

    // Check if user already exists
    const existingUser = await User.findOne({ email, gymId });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Validate role permissions
    if (req.user.role === 'gym_admin' && !['trainer', 'member'].includes(role)) {
      return res.status(403).json({ message: 'Cannot create users with this role' });
    }

    const newUser = new User({
      gymId,
      email,
      password,
      phone,
      role,
      profile: {
        firstName,
        lastName
      }
    });

    await newUser.save();

    // Remove password from response
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: 'User created successfully',
      user: userResponse
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, phone, status, role } = req.body;
    const gymId = req.gymId;

    const user = await User.findOne({ _id: id, gymId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check permissions
    if (req.user.role === 'gym_admin' && user.role === 'gym_admin' && req.user.id !== id) {
      return res.status(403).json({ message: 'Cannot update other admin users' });
    }

    // Update fields
    if (firstName) user.profile.firstName = firstName;
    if (lastName) user.profile.lastName = lastName;
    if (phone) user.phone = phone;
    if (status) user.status = status;
    if (role && req.user.role === 'gym_admin' && ['trainer', 'member'].includes(role)) {
      user.role = role;
    }

    await user.save();

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete/deactivate user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const gymId = req.gymId;

    const user = await User.findOne({ _id: id, gymId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check permissions
    if (req.user.role === 'gym_admin' && user.role === 'gym_admin') {
      return res.status(403).json({ message: 'Cannot delete admin users' });
    }

    // Soft delete - change status to inactive
    user.status = 'inactive';
    await user.save();

    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};