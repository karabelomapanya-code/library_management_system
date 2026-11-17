import express from 'express';
import { pool } from '../config/db.js';

const router = express.Router();

// GET history (with book + user names joined in)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT t.*, b.title AS book_title, u.name AS user_name
      FROM transactions t
      JOIN books b ON b.id = t.book_id
      LEFT JOIN users u ON u.id = t.user_id
      ORDER BY t.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST transaction (add stock or borrow)
router.post('/', async (req, res) => {
  const { book_id, user_id, type, quantity } = req.body;

  if (!book_id || !type || !quantity || quantity <= 0) {
    return res.status(400).json({ error: 'book_id, type, quantity(>0) are required' });
  }
  if (!['add', 'borrow'].includes(type)) {
    return res.status(400).json({ error: 'type must be "add" or "borrow"' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [bookRows] = await conn.query(
      'SELECT quantity FROM books WHERE id = ? FOR UPDATE',
      [book_id]
    );
    if (!bookRows.length) {
      await conn.rollback();
      return res.status(404).json({ error: 'Book not found' });
    }

    const current = bookRows[0].quantity;
    const newQty = type === 'add' ? current + Number(quantity) : current - Number(quantity);

    if (newQty < 0) {
      await conn.rollback();
      return res.status(400).json({ error: 'Not enough stock to borrow' });
    }

    await conn.query('UPDATE books SET quantity = ? WHERE id = ?', [newQty, book_id]);
    const [result] = await conn.query(
      'INSERT INTO transactions (book_id, user_id, type, quantity) VALUES (?, ?, ?, ?)',
      [book_id, user_id || null, type, quantity]
    );

    await conn.commit();
    res.status(201).json({
      id: result.insertId,
      book_id,
      user_id: user_id || null,
      type,
      quantity,
      newQuantity: newQty,
    });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

export default router;