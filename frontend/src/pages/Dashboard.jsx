import { useEffect, useState } from 'react';
import { api } from '../api';

export default function Dashboard() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getBooks()
      .then(setBooks)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  const totalCopies = books.reduce((s, b) => s + b.quantity, 0);
  const lowStock = books.filter((b) => b.quantity < 2);

  return (
    <div>
      <div className="stats">
        <div className="stat-card">
          <div className="num">{books.length}</div>
          <div className="label">Total Book Titles</div>
        </div>
        <div className="stat-card">
          <div className="num">{totalCopies}</div>
          <div className="label">Total Copies in Stock</div>
        </div>
        <div className="stat-card">
          <div className="num" style={{ color: '#dc2626' }}>{lowStock.length}</div>
          <div className="label">Low-Stock Titles (&lt; 2)</div>
        </div>
      </div>

      <div className="card">
        <h2>📖 Book Availability</h2>
        <table>
          <thead>
            <tr>
              <th>Title</th><th>Author</th><th>Genre</th><th>ISBN</th><th>Quantity</th>
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
              </tr>
            ))}
            {!books.length && (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No books yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}