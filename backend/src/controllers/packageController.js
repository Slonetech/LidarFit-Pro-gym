import ServicePackage from '../models/ServicePackage.js';

export const listPackages = async (req, res) => {
  try {
    const items = await ServicePackage.find({ gym: req.user.gym, isActive: true }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to list packages', error: err.message });
  }
};

export const createPackage = async (req, res) => {
  try {
    const created = await ServicePackage.create({ ...req.body, gym: req.user.gym });
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create package', error: err.message });
  }
};

export const updatePackage = async (req, res) => {
  try {
    const updated = await ServicePackage.findOneAndUpdate({ _id: req.params.id, gym: req.user.gym }, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Package not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update package', error: err.message });
  }
};

export const deletePackage = async (req, res) => {
  try {
    const updated = await ServicePackage.findOneAndUpdate({ _id: req.params.id, gym: req.user.gym }, { isActive: false }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Package not found' });
    res.json({ message: 'Package archived' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete package', error: err.message });
  }
};


