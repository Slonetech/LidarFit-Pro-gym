import Todo from '../models/Todo.js';

export const listTodos = async (req, res) => {
  try {
    const filter = { gym: req.user.gym };
    if (req.user.role === 'customer') filter.customer = req.user._id;
    if (req.query.customer) filter.customer = req.query.customer;
    const items = await Todo.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to list todos', error: err.message });
  }
};

export const createTodo = async (req, res) => {
  try {
    const created = await Todo.create({ ...req.body, gym: req.user.gym, assignedBy: req.user._id });
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create todo', error: err.message });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const filter = { _id: req.params.id, gym: req.user.gym };
    if (req.user.role === 'customer') filter.customer = req.user._id;
    const updated = await Todo.findOneAndUpdate(filter, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Todo not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update todo', error: err.message });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const filter = { _id: req.params.id, gym: req.user.gym };
    if (req.user.role === 'customer') filter.customer = req.user._id;
    const removed = await Todo.findOneAndDelete(filter);
    if (!removed) return res.status(404).json({ message: 'Todo not found' });
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete todo', error: err.message });
  }
};


