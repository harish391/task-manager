import { Response } from 'express';
import Task, { TaskStatus, TaskPriority } from '../models/Task';
import { AuthenticatedRequest } from '../middleware/auth';

export const getTasks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const tasks = await Task.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const createTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const task = new Task({
      title,
      description,
      priority: priority || TaskPriority.MEDIUM,
      status: TaskStatus.TODO,
      userId: req.userId,
      dueDate,
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const getTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const updateTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { title, description, status, priority, dueDate },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const deleteTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};
