import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Transactions from './pages/Transactions';
import Users from './pages/Users';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <h1>📚 Library System</h1>
        <div className="nav-links">
          <Link to="/">Dashboard</Link>
          <Link to="/books">Books</Link>
          <Link to="/transactions">Transactions</Link>
          <Link to="/users">Users</Link>
        </div>
      </nav>
      <main className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/books" element={<Books />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}