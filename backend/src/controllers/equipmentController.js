import Equipment from '../models/Equipment.js';

export const listEquipment = async (req, res) => {
  try {
    const items = await Equipment.find({ gym: req.user.gym }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to list equipment', error: err.message });
  }
};

export const createEquipment = async (req, res) => {
  try {
    const created = await Equipment.create({ ...req.body, gym: req.user.gym });
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create equipment', error: err.message });
  }
};

export const updateEquipment = async (req, res) => {
  try {
    const updated = await Equipment.findOneAndUpdate({ _id: req.params.id, gym: req.user.gym }, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Equipment not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update equipment', error: err.message });
  }
};

export const deleteEquipment = async (req, res) => {
  try {
    const removed = await Equipment.findOneAndDelete({ _id: req.params.id, gym: req.user.gym });
    if (!removed) return res.status(404).json({ message: 'Equipment not found' });
    res.json({ message: 'Equipment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete equipment', error: err.message });
  }
};


