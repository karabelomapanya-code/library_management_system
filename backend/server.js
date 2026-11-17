import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './config/db.js';
import booksRouter from './routes/books.js';
import usersRouter from './routes/users.js';
import transactionsRouter from './routes/transactions.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'API running', database: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'API running', database: 'ERROR', error: err.message });
  }
});

app.use('/books', booksRouter);
app.use('/users', usersRouter);
app.use('/transactions', transactionsRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend on http://localhost:${PORT}`));