const express = require('express');
const Task = require('../models/Task');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// Get all tasks for the logged-in user
router.get('/', verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new task
router.post('/', verifyToken, async (req, res) => {
  const { text, priority, dueDate } = req.body;

  try {
    const task = new Task({
      text,
      priority,
      dueDate,
      user: req.user.id,
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a task
router.put('/:id', verifyToken, async (req, res) => {
  const { text, priority, dueDate, completed } = req.body;

  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    task.text = text;
    task.priority = priority;
    task.dueDate = dueDate;
    task.completed = completed;
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a task
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await task.remove();
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
