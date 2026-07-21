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

const isTodayOrLater = (value: string): boolean => {
  const dueDate = new Date(value);
  const today = new Date();
  dueDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return dueDate >= today;
};

const validateTaskInput = (body: Record<string, unknown>): string | null => {
  const { title, priority, status, due_date: dueDate } = body;

  if (typeof title !== 'string' || !title.trim()) {
    return 'Title is required';
  }
  if (typeof priority !== 'string' || !priority) {
    return 'Priority is required';
  }
  if (!validPriorities.includes(priority)) {
    return 'Priority must be Low, Medium, or High';
  }
  if (typeof status !== 'string' || !status) {
    return 'Status is required';
  }
  if (!validStatuses.includes(status)) {
    return 'Status must be Pending, In Progress, or Completed';
  }
  if (typeof dueDate !== 'string' || !dueDate) {
    return 'Due date is required';
  }
  if (!isValidDate(dueDate)) {
    return 'Due date must be a valid date';
  }
  if (!isTodayOrLater(dueDate)) {
    return 'Due date cannot be earlier than today';
  }
  return null;
};

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
    const validationError = validateTaskInput(req.body);
    if (validationError) {
      res.status(400).json({ error: validationError });
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
    const validationError = validateTaskInput(req.body);
    if (validationError) {
      res.status(400).json({ error: validationError });
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
