import { query } from '../config/db';

export interface Task {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'In Progress' | 'Completed';
  due_date: string;
  created_at: string;
  updated_at: string;
}

export const getAllTasks = async (userId: number) => {
  const result = await query('SELECT * FROM Tasks WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
  return result.rows;
};

export const getTaskById = async (id: number, userId: number) => {
  const result = await query('SELECT * FROM Tasks WHERE id = $1 AND user_id = $2', [id, userId]);
  return result.rows[0];
};

export const createTask = async (
  userId: number,
  title: string,
  description: string | null,
  priority: string,
  status: string,
  due_date: string
) => {
  const result = await query(
    `INSERT INTO Tasks (user_id, title, description, priority, status, due_date)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [userId, title, description, priority, status, due_date]
  );
  return result.rows[0];
};

export const updateTask = async (
  id: number,
  userId: number,
  title: string,
  description: string | null,
  priority: string,
  status: string,
  due_date: string
) => {
  const result = await query(
    `UPDATE Tasks SET title = $1, description = $2, priority = $3, status = $4, due_date = $5, updated_at = CURRENT_TIMESTAMP
     WHERE id = $6 AND user_id = $7 RETURNING *`,
    [title, description, priority, status, due_date, id, userId]
  );
  return result.rows[0];
};

export const deleteTask = async (id: number, userId: number) => {
  const result = await query('DELETE FROM Tasks WHERE id = $1 AND user_id = $2 RETURNING *', [id, userId]);
  return result.rows[0];
};
