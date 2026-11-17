import { useEffect, useState } from 'react';
import { api } from '../api';

const emptyForm = { title: '', author: '', genre: '', isbn: '', quantity: 0 };

export default function Books() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const load = () => api.getBooks().then(setBooks).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim() || !form.author.trim() || !form.isbn.trim()) {
      setError('Title, Author, and ISBN are required.');
      return;
    }
    if (Number(form.quantity) < 0) {
      setError('Quantity cannot be negative.');
      return;
    }
    try {
      if (editingId) {
        await api.updateBook(editingId, form);
      } else {
        await api.createBook(form);
      }
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (b) => {
    setForm({ title: b.title, author: b.author, genre: b.genre || '', isbn: b.isbn, quantity: b.quantity });
    setEditingId(b.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this book?')) return;
    try { await api.deleteBook(id); load(); } catch (e) { setError(e.message); }
  };

  const cancelEdit = () => { setForm(emptyForm); setEditingId(null); setError(''); };

  return (
    <div>
      <div className="card">
        <h2>{editingId ? '✏️ Edit Book' : '➕ Add New Book'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <input name="title" placeholder="Title *" value={form.title} onChange={handleChange} />
            <input name="author" placeholder="Author *" value={form.author} onChange={handleChange} />
            <input name="genre" placeholder="Genre" value={form.genre} onChange={handleChange} />
            <input name="isbn" placeholder="ISBN *" value={form.isbn} onChange={handleChange} />
            <input name="quantity" type="number" min="0" placeholder="Quantity" value={form.quantity} onChange={handleChange} />
          </div>
          {error && <p className="error">{error}</p>}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit">{editingId ? 'Update' : 'Add Book'}</button>
            {editingId && <button type="button" className="secondary" onClick={cancelEdit}>Cancel</button>}
          </div>
        </form>
      </div>

      <div className="card">
        <h2>📚 Book List</h2>
        <table>
          <thead>
            <tr>
              <th>Title</th><th>Author</th><th>Genre</th><th>ISBN</th><th>Qty</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((b) => (
              <tr key={b.id} className={b.quantity < 2 ? 'low-stock' : ''}>
                <td>{b.title}</td>
                <td>{b.author}</td>
                <td>{b.genre || '—'}</td>
                <td>{b.isbn}</td>
                <td>{b.quantity}</td>
                <td>
                  <button style={{ marginRight: '0.4rem' }} onClick={() => startEdit(b)}>Edit</button>
                  <button className="danger" onClick={() => handleDelete(b.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {!books.length && (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No books yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}