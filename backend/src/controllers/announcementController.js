import Announcement from '../models/Announcement.js';

export const listAnnouncements = async (req, res) => {
  try {
    const filter = { gym: req.user.gym, isActive: true };
    if (req.user.role === 'customer') filter.$or = [{ audience: 'all' }, { audience: 'customers' }];
    const items = await Announcement.find(filter).sort({ publishedAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to list announcements', error: err.message });
  }
};

export const createAnnouncement = async (req, res) => {
  try {
    const created = await Announcement.create({ ...req.body, gym: req.user.gym, createdBy: req.user._id });
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create announcement', error: err.message });
  }
};

export const updateAnnouncement = async (req, res) => {
  try {
    const updated = await Announcement.findOneAndUpdate({ _id: req.params.id, gym: req.user.gym }, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Announcement not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update announcement', error: err.message });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const updated = await Announcement.findOneAndUpdate({ _id: req.params.id, gym: req.user.gym }, { isActive: false }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Announcement not found' });
    res.json({ message: 'Announcement archived' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete announcement', error: err.message });
  }
};


