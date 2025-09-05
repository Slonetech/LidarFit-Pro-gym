import Attendance from '../models/Attendance.js';

export const listAttendance = async (req, res) => {
  try {
    const filter = { gym: req.user.gym };
    if (req.user.role === 'customer') filter.customer = req.user._id;
    const items = await Attendance.find(filter).sort({ checkInAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to list attendance', error: err.message });
  }
};

export const checkIn = async (req, res) => {
  try {
    const doc = await Attendance.create({
      gym: req.user.gym,
      customer: req.user.role === 'customer' ? req.user._id : req.body.customer,
      processedBy: req.user._id,
      notes: req.body.notes || undefined
    });
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ message: 'Failed to check in', error: err.message });
  }
};

export const checkOut = async (req, res) => {
  try {
    const filter = { _id: req.params.id, gym: req.user.gym };
    if (req.user.role === 'customer') filter.customer = req.user._id;
    const updated = await Attendance.findOneAndUpdate(filter, { checkOutAt: new Date() }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Attendance not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to check out', error: err.message });
  }
};


