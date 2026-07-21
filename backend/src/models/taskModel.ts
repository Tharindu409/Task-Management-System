import { query } from '../config/db';

export interface Task {
  id: number;
  title: string;
  description?: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'In Progress' | 'Completed';
  due_date: string;
  created_at: string;
  updated_at: string;
}

export const getAllTasks = async () => {
  const result = await query('SELECT * FROM Tasks ORDER BY created_at DESC');
  return result.rows;
};

export const getTaskById = async (id: number) => {
  const result = await query('SELECT * FROM Tasks WHERE id = $1', [id]);
  return result.rows[0];
};

export const createTask = async (
  title: string,
  description: string | null,
  priority: string,
  status: string,
  due_date: string
) => {
  const result = await query(
    `INSERT INTO Tasks (title, description, priority, status, due_date)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [title, description, priority, status, due_date]
  );
  return result.rows[0];
};

export const updateTask = async (
  id: number,
  title: string,
  description: string | null,
  priority: string,
  status: string,
  due_date: string
) => {
  const result = await query(
    `UPDATE Tasks SET title = $1, description = $2, priority = $3, status = $4, due_date = $5, updated_at = CURRENT_TIMESTAMP
     WHERE id = $6 RETURNING *`,
    [title, description, priority, status, due_date, id]
  );
  return result.rows[0];
};

export const deleteTask = async (id: number) => {
  const result = await query('DELETE FROM Tasks WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};
