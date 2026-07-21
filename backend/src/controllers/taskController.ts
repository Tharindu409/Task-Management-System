import { Request, Response } from 'express';
import * as taskModel from '../models/taskModel';

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const tasks = await taskModel.getAllTasks();
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await taskModel.getTaskById(parseInt(req.params.id));
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

export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, priority, status, due_date } = req.body;

    if (!title || !priority || !status || !due_date) {
      res.status(400).json({ error: 'Title, priority, status, and due_date are required' });
      return;
    }

    const validPriorities = ['Low', 'Medium', 'High'];
    const validStatuses = ['Pending', 'In Progress', 'Completed'];

    if (!validPriorities.includes(priority)) {
      res.status(400).json({ error: 'Priority must be Low, Medium, or High' });
      return;
    }

    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: 'Status must be Pending, In Progress, or Completed' });
      return;
    }

    const task = await taskModel.createTask(title, description || null, priority, status, due_date);
    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, priority, status, due_date } = req.body;

    if (!title || !priority || !status || !due_date) {
      res.status(400).json({ error: 'Title, priority, status, and due_date are required' });
      return;
    }

    const task = await taskModel.updateTask(
      parseInt(req.params.id),
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

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await taskModel.deleteTask(parseInt(req.params.id));
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
