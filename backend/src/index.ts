import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import { query } from './config/db';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Task Management System API is running.');
});

// Start the server and test DB connection
app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  try {
    const res = await query('SELECT NOW()');
    console.log('PostgreSQL connected at:', res.rows[0].now);
  } catch (err) {
    console.error('Failed to connect to PostgreSQL:', err);
  }
});
