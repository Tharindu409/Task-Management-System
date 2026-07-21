import { query } from '../config/db';

export const findUserByEmail = async (email: string) => {
  const result = await query('SELECT * FROM Users WHERE email = $1', [email]);
  return result.rows[0];
};

export const findUserById = async (id: number) => {
  const result = await query('SELECT id, name, email, created_at, updated_at FROM Users WHERE id = $1', [id]);
  return result.rows[0];
};
