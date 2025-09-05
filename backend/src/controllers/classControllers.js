import Class from '../models/Class.js';

// Create class
export const createClass = async (req, res) => {
  try {
    const newClass = new Class({ ...req.body, gymId: req.gymId });
    await newClass.save();
    res.status(201).json(newClass);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create class', error: err.message });
  }
};

// List classes for gym
export const getClasses = async (req, res) => {
  try {
    const classes = await Class.find({ gymId: req.gymId });
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get classes', error: err.message });
  }
};

// Get single class
export const getClassById = async (req, res) => {
  try {
    const foundClass = await Class.findOne({ _id: req.params.id, gymId: req.gymId });
    if (!foundClass) return res.status(404).json({ message: 'Class not found' });
    res.json(foundClass);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get class', error: err.message });
  }
};

// Update class
export const updateClass = async (req, res) => {
  try {
    const updatedClass = await Class.findOneAndUpdate(
      { _id: req.params.id, gymId: req.gymId },
      req.body,
      { new: true }
    );
    if (!updatedClass) return res.status(404).json({ message: 'Class not found' });
    res.json(updatedClass);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update class', error: err.message });
  }
};

// Delete class
export const deleteClass = async (req, res) => {
  try {
    const deleted = await Class.findOneAndDelete({ _id: req.params.id, gymId: req.gymId });
    if (!deleted) return res.status(404).json({ message: 'Class not found' });
    res.json({ message: 'Class deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete class', error: err.message });
  }
};
