const jwt = require('jsonwebtoken');

// Mock data store (replace with database later)
let mockGyms = [];
let mockUsers = [];

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '30d' });
};

// Register new gym
const registerGym = async (req, res) => {
  try {
    const { gymName, gymEmail, adminEmail, adminPassword, adminFirstName, adminLastName } = req.body;

    console.log('Register gym request:', { gymName, gymEmail, adminEmail });

    // Check if gym exists
    const existingGym = mockGyms.find(gym => gym.email === gymEmail);
    if (existingGym) {
      return res.status(400).json({ message: 'Gym already exists' });
    }

    // Create gym
    const gym = {
      id: Date.now().toString(),
      name: gymName,
      email: gymEmail,
      status: 'trial',
      createdAt: new Date()
    };
    mockGyms.push(gym);

    // Create admin user
    const adminUser = {
      id: Date.now().toString() + '_admin',
      gymId: gym.id,
      email: adminEmail,
      password: adminPassword,
      role: 'gym_admin',
      profile: {
        firstName: adminFirstName,
        lastName: adminLastName
      },
      createdAt: new Date()
    };
    mockUsers.push(adminUser);

    const token = generateToken(adminUser.id);

    res.status(201).json({
      message: 'Gym and admin created successfully',
      token,
      user: {
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
        gymId: gym.id,
        gymName: gym.name
      }
    });
  } catch (error) {
    console.error('Register gym error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login request:', { email });

    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const gym = mockGyms.find(g => g.id === user.gymId);
    const token = generateToken(user.id);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile,
        gymId: user.gymId,
        gymName: gym?.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get stats
const getStats = async (req, res) => {
  console.log('Stats request received');
  res.json({
    message: 'Auth stats working!',
    totalGyms: mockGyms.length,
    totalUsers: mockUsers.length,
    mockData: true,
    gyms: mockGyms,
    users: mockUsers.map(u => ({ id: u.id, email: u.email, role: u.role }))
  });
};

module.exports = {
  registerGym,
  login,
  getStats
};