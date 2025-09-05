const Gym = require('../models/Gym');
const User = require('../models/User');

// Get gym details
const getGymDetails = async (req, res) => {
  try {
    const gym = await Gym.findById(req.gymId);
    if (!gym) {
      return res.status(404).json({ message: 'Gym not found' });
    }

    res.json(gym);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update gym details
const updateGymDetails = async (req, res) => {
  try {
    const { name, address, phone, email, brandingConfig } = req.body;

    const gym = await Gym.findById(req.gymId);
    if (!gym) {
      return res.status(404).json({ message: 'Gym not found' });
    }

    // Update fields
    if (name) gym.name = name;
    if (address) gym.address = address;
    if (phone) gym.phone = phone;
    if (email) gym.email = email;
    if (brandingConfig) gym.brandingConfig = { ...gym.brandingConfig, ...brandingConfig };

    await gym.save();

    res.json({ message: 'Gym details updated successfully', gym });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get gym statistics
const getGymStats = async (req, res) => {
  try {
    const gymId = req.gymId;

    // Count users by role
    const stats = await User.aggregate([
      { $match: { gymId: gymId } },
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // Format stats
    const formattedStats = {
      totalMembers: 0,
      totalTrainers: 0,
      totalAdmins: 0,
      totalUsers: 0
    };

    stats.forEach(stat => {
      switch (stat._id) {
        case 'member':
          formattedStats.totalMembers = stat.count;
          break;
        case 'trainer':
          formattedStats.totalTrainers = stat.count;
          break;
        case 'gym_admin':
          formattedStats.totalAdmins = stat.count;
          break;
      }
      formattedStats.totalUsers += stat.count;
    });

    // Add more stats (we'll expand this later)
    formattedStats.activeClasses = 0; // TODO: Implement
    formattedStats.todayBookings = 0; // TODO: Implement
    formattedStats.monthlyRevenue = 0; // TODO: Implement

    res.json(formattedStats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all gyms (super admin only)
const getAllGyms = async (req, res) => {
  try {
    const gyms = await Gym.find()
      .select('-__v')
      .sort({ createdAt: -1 });

    res.json(gyms);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getGymDetails,
  updateGymDetails,
  getGymStats,
  getAllGyms
}; 