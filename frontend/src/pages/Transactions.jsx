import { useEffect, useState } from 'react';
import { api } from '../api';

export default function Transactions() {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [history, setHistory] = useState([]);
  const [form, setForm] = useState({ book_id: '', user_id: '', type: 'borrow', quantity: 1 });
  const [error, setError] = useState('');

  const loadAll = () =>
    Promise.all([api.getBooks(), api.getUsers(), api.getTransactions()])
      .then(([b, u, h]) => { setBooks(b); setUsers(u); setHistory(h); })
      .catch((e) => setError(e.message));

  useEffect(() => { loadAll(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.book_id) { setError('Please select a book.'); return; }
    if (Number(form.quantity) <= 0) { setError('Quantity must be positive.'); return; }

    try {
      await api.createTransaction({
        book_id: Number(form.book_id),
        user_id: form.user_id ? Number(form.user_id) : null,
        type: form.type,
        quantity: Number(form.quantity),
      });
      setForm({ book_id: '', user_id: '', type: 'borrow', quantity: 1 });
      loadAll();
    } catch (err) { setError(err.message); }
  };

  return (
    <div>
      <div className="card">
        <h2>🔄 Record Transaction</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <select name="book_id" value={form.book_id} onChange={handleChange}>
              <option value="">Select book *</option>
              {books.map((b) => (
                <option key={b.id} value={b.id}>{b.title} (stock: {b.quantity})</option>
              ))}
            </select>

            <select name="user_id" value={form.user_id} onChange={handleChange}>
              <option value="">No user (stock arrival)</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.name} — {u.membership_id}</option>
              ))}
            </select>

            <select name="type" value={form.type} onChange={handleChange}>
              <option value="add">Add stock</option>
              <option value="borrow">Borrow</option>
            </select>

            <input name="quantity" type="number" min="1" value={form.quantity} onChange={handleChange} />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit">Record Transaction</button>
        </form>
      </div>

      <div className="card">
        <h2>🧾 Transaction History</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th><th>Book</th><th>User</th><th>Type</th><th>Qty</th>
            </tr>
          </thead>
          <tbody>
            {history.map((t) => (
              <tr key={t.id}>
                <td>{new Date(t.created_at).toLocaleString()}</td>
                <td>{t.book_title}</td>
                <td>{t.user_name || '—'}</td>
                <td>
                  <span className={`badge ${t.type === 'add' ? 'badge-add' : 'badge-borrow'}`}>
                    {t.type}
                  </span>
                </td>
                <td>{t.quantity}</td>
              </tr>
            ))}
            {!history.length && (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No transactions yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}