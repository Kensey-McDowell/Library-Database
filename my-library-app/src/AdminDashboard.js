import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Logo from './assets/MBLS_Logo.png';
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState({ books: 0, users: 0, branches: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    // Fetch admin summary data from backend
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/stats');
        if (!response.ok) throw new Error("Failed to fetch stats");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error(error);
        setStats({ books: 235, users: 58, branches: 10 });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="AdminDashboard">
      <div className={`fade-in fade-delay-1 ${isVisible ? 'visible' : ''}`}>
        <nav className="navbar">
          <Link to="/">
            <img src={Logo} width={70} height={70} alt="logo" />
          </Link>
          <h1 className="main-title">Library Admin Dashboard</h1>
          <div className="top-right-buttons">
            <label className="switch">
              <span className="slider"></span>
            </label>
            <Link to="/Login">
              <button>Logout</button>
            </Link>
          </div>
        </nav>
        <div className='AdminShelf'>
        {/* Dashboard Content */}
        <div className={`dashboard-content fade-in fade-delay-2 ${isVisible ? 'visible' : ''}`}>
          <h2>Welcome, Admin</h2>
          {loading ? (
            <p>Loading statistics...</p>
          ) : (
            <div className="stats-grid">
              <div className="stat-card">
                <h3>{stats.books}</h3>
                <p>Total Books</p>
              </div>
              <div className="stat-card">
                <h3>{stats.users}</h3>
                <p>Registered Users</p>
              </div>
              <div className="stat-card">
                <h3>{stats.branches}</h3>
                <p>Library Branches</p>
              </div>
            </div>
          )}

          <div className="admin-actions">
            <div className="action-card">
              <h4>Manage Books</h4>
              <p>View, add, or remove books from the catalog.</p>

              <Link to="/bookadd">
                  <button>Add Book</button>
              </Link>

            </div>
            <div className="action-card">
              <h4>Manage Users</h4>
              <p>View and manage registered patrons.</p>
              <button onClick={() => alert("Go to user management!")}>Open</button>
            </div>
            <div className="action-card">
              <h4>Manage Branches</h4>
              <p>Update library locations and details.</p>
              <button onClick={() => alert("Go to branch management!")}>Open</button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
