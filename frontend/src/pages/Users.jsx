import { useEffect, useState } from 'react';
import { api } from '../api';

const emptyForm = { name: '', membership_id: '', role: 'member', password: '' };

export default function Users() {
  const [session, setSession] = useState(null);
  const [loginForm, setLoginForm] = useState({ membership_id: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const loadUsers = () => api.getUsers().then(setUsers).catch((e) => setError(e.message));

  useEffect(() => {
    if (session?.role === 'admin') loadUsers();
  }, [session]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const user = await api.login(loginForm);
      setSession(user);
      setLoginForm({ membership_id: '', password: '' });
    } catch (err) {
      setLoginError(err.message);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.membership_id.trim()) {
      setError('Name and Membership ID are required.');
      return;
    }
    if (!editingId && !form.password.trim()) {
      setError('Password is required for new users.');
      return;
    }
    try {
      if (editingId) {
        await api.updateUser(editingId, {
          name: form.name, membership_id: form.membership_id, role: form.role,
        });
      } else {
        await api.createUser(form);
      }
      setForm(emptyForm);
      setEditingId(null);
      loadUsers();
    } catch (err) { setError(err.message); }
  };

  const startEdit = (u) => {
    setForm({ name: u.name, membership_id: u.membership_id, role: u.role, password: '' });
    setEditingId(u.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try { await api.deleteUser(id); loadUsers(); } catch (e) { setError(e.message); }
  };

  // Login view
  if (!session) {
    return (
      <div className="card" style={{ maxWidth: 420, margin: '2rem auto' }}>
        <h2>🔐 Login</h2>
        <form onSubmit={handleLogin}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <input
              placeholder="Membership ID"
              value={loginForm.membership_id}
              onChange={(e) => setLoginForm({ ...loginForm, membership_id: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            />
            {loginError && <p className="error">{loginError}</p>}
            <button type="submit">Login</button>
          </div>
        </form>
        <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
          Use <strong>ADMIN001 / admin123</strong> for admin access.
        </p>
      </div>
    );
  }

  // Logged in but not admin
  if (session.role !== 'admin') {
    return (
      <div className="card">
        <h2>Welcome, {session.name}</h2>
        <p>You are logged in as a <strong>{session.role}</strong>.</p>
        <button className="secondary" onClick={() => setSession(null)}>Logout</button>
      </div>
    );
  }

  // Admin view
  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>👋 Admin: {session.name}</h2>
          <button className="secondary" onClick={() => setSession(null)}>Logout</button>
        </div>

        <h3 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>
          {editingId ? '✏️ Edit User' : '➕ Add New User'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <input name="name" placeholder="Name *" value={form.name} onChange={handleChange} />
            <input name="membership_id" placeholder="Membership ID *" value={form.membership_id} onChange={handleChange} />
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="member">member</option>
              <option value="admin">admin</option>
            </select>
            {!editingId && (
              <input name="password" type="password" placeholder="Password *" value={form.password} onChange={handleChange} />
            )}
          </div>
          {error && <p className="error">{error}</p>}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit">{editingId ? 'Update' : 'Add User'}</button>
            {editingId && (
              <button type="button" className="secondary" onClick={() => { setForm(emptyForm); setEditingId(null); }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        <h2>👥 User List</h2>
        <table>
          <thead>
            <tr><th>Name</th><th>Membership ID</th><th>Role</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.membership_id}</td>
                <td><span className="badge badge-add">{u.role}</span></td>
                <td>
                  <button style={{ marginRight: '0.4rem' }} onClick={() => startEdit(u)}>Edit</button>
                  <button className="danger" onClick={() => handleDelete(u.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {!users.length && (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No users yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}