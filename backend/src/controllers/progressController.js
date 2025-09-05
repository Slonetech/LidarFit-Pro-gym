import MemberProgress from '../models/MemberProgress.js';

export const listProgress = async (req, res) => {
  try {
    const filter = { gym: req.user.gym };
    if (req.user.role === 'customer') filter.customer = req.user._id;
    const items = await MemberProgress.find(filter).sort({ measuredAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to list progress', error: err.message });
  }
};

export const addProgress = async (req, res) => {
  try {
    const data = { ...req.body, gym: req.user.gym };
    if (req.user.role === 'customer') data.customer = req.user._id;
    const created = await MemberProgress.create(data);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create progress', error: err.message });
  }
};

export const updateProgress = async (req, res) => {
  try {
    const filter = { _id: req.params.id, gym: req.user.gym };
    if (req.user.role === 'customer') filter.customer = req.user._id;
    const updated = await MemberProgress.findOneAndUpdate(filter, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Progress not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update progress', error: err.message });
  }
};

export const deleteProgress = async (req, res) => {
  try {
    const filter = { _id: req.params.id, gym: req.user.gym };
    if (req.user.role === 'customer') filter.customer = req.user._id;
    const removed = await MemberProgress.findOneAndDelete(filter);
    if (!removed) return res.status(404).json({ message: 'Progress not found' });
    res.json({ message: 'Progress deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete progress', error: err.message });
  }
};


