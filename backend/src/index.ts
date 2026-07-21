import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
import { query } from './config/db';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.send('Task Management System API is running.');
});

// Start the server and test DB connection
app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  try {
    const res = await query('SELECT NOW()');
    console.log('PostgreSQL connected at:', res.rows[0].now);

    // Initialize database tables
    await query(`
      CREATE TABLE IF NOT EXISTS Users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS Tasks (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES Users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        priority VARCHAR(50) NOT NULL CHECK (priority IN ('Low', 'Medium', 'High')),
        status VARCHAR(50) NOT NULL CHECK (status IN ('Pending', 'In Progress', 'Completed')),
        due_date TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insert default admin user if it does not exist
    await query(`
      INSERT INTO Users (name, email, password) 
      VALUES ('Admin', 'admin@test.com', '$2b$10$5LvBmDtTluvJ.s4Lc7XiverJG/4bmSF0HTd/Gbx7XWJh572nyBZY2')
      ON CONFLICT (email) DO NOTHING;
    `);
    console.log('Database tables verified/created successfully.');
  } catch (err) {
    console.error('Failed to connect to PostgreSQL or initialize schema:', err);
  }
});
