import express from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';

const router = express.Router();

// GET all users
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, membership_id, role FROM users ORDER BY id DESC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE user
router.post('/', async (req, res) => {
  const { name, membership_id, role, password } = req.body;
  if (!name || !membership_id || !password) {
    return res.status(400).json({ error: 'name, membership_id, password are required' });
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, membership_id, role, password) VALUES (?, ?, ?, ?)',
      [name, membership_id, role || 'member', hash]
    );
    res.status(201).json({ id: result.insertId, name, membership_id, role: role || 'member' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE user
router.put('/:id', async (req, res) => {
  const { name, membership_id, role } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE users SET name=?, membership_id=?, role=? WHERE id=?',
      [name, membership_id, role, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { membership_id, password } = req.body;
  if (!membership_id || !password) {
    return res.status(400).json({ error: 'membership_id and password are required' });
  }
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE membership_id = ?', [membership_id]);
    if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });
    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ id: user.id, name: user.name, membership_id: user.membership_id, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;