import { Request, Response } from 'express';
import * as taskModel from '../models/taskModel';
import { AuthRequest } from '../middlewares/authMiddleware';

const validPriorities = ['Low', 'Medium', 'High'];
const validStatuses = ['Pending', 'In Progress', 'Completed'];

const getAuthenticatedUserId = (req: AuthRequest): number | null => {
  const userId = req.user?.userId;
  return typeof userId === 'number' ? userId : null;
};

const isValidDate = (value: string): boolean => !Number.isNaN(Date.parse(value));

export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const tasks = await taskModel.getAllTasks(userId);
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const taskId = Number(req.params.id);
    if (!Number.isInteger(taskId) || taskId <= 0) {
      res.status(400).json({ error: 'Task id must be a positive integer' });
      return;
    }

    const task = await taskModel.getTaskById(taskId, userId);
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { title, description, priority, status, due_date } = req.body;

    if (!title || !priority || !status || !due_date) {
      res.status(400).json({ error: 'Title, priority, status, and due_date are required' });
      return;
    }

    if (!validPriorities.includes(priority)) {
      res.status(400).json({ error: 'Priority must be Low, Medium, or High' });
      return;
    }

    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: 'Status must be Pending, In Progress, or Completed' });
      return;
    }

    if (!isValidDate(due_date)) {
      res.status(400).json({ error: 'due_date must be a valid date' });
      return;
    }

    const task = await taskModel.createTask(userId, title, description || null, priority, status, due_date);
    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const taskId = Number(req.params.id);
    if (!Number.isInteger(taskId) || taskId <= 0) {
      res.status(400).json({ error: 'Task id must be a positive integer' });
      return;
    }

    const { title, description, priority, status, due_date } = req.body;

    if (!title || !priority || !status || !due_date) {
      res.status(400).json({ error: 'Title, priority, status, and due_date are required' });
      return;
    }

    if (!validPriorities.includes(priority)) {
      res.status(400).json({ error: 'Priority must be Low, Medium, or High' });
      return;
    }

    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: 'Status must be Pending, In Progress, or Completed' });
      return;
    }

    if (!isValidDate(due_date)) {
      res.status(400).json({ error: 'due_date must be a valid date' });
      return;
    }

    const task = await taskModel.updateTask(
      taskId,
      userId,
      title,
      description || null,
      priority,
      status,
      due_date
    );

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.json(task);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const taskId = Number(req.params.id);
    if (!Number.isInteger(taskId) || taskId <= 0) {
      res.status(400).json({ error: 'Task id must be a positive integer' });
      return;
    }

    const task = await taskModel.deleteTask(taskId, userId);
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
