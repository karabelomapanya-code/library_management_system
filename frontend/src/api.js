const BASE = 'http://localhost:5000';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  getBooks: () => request('/books'),
  createBook: (b) => request('/books', { method: 'POST', body: JSON.stringify(b) }),
  updateBook: (id, b) => request(`/books/${id}`, { method: 'PUT', body: JSON.stringify(b) }),
  deleteBook: (id) => request(`/books/${id}`, { method: 'DELETE' }),

  getUsers: () => request('/users'),
  createUser: (u) => request('/users', { method: 'POST', body: JSON.stringify(u) }),
  updateUser: (id, u) => request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(u) }),
  deleteUser: (id) => request(`/users/${id}`, { method: 'DELETE' }),
  login: (creds) => request('/users/login', { method: 'POST', body: JSON.stringify(creds) }),

  getTransactions: () => request('/transactions'),
  createTransaction: (t) => request('/transactions', { method: 'POST', body: JSON.stringify(t) }),
};