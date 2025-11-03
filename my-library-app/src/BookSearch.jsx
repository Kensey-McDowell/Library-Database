import { Link } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import Logo from './assets/MBLS_Logo.png';
import './App.css';
import './bookadd.css'; // reuse same styling
import { ThemeContext } from './App';

export default function BookSearchPage() {
  const { theme, setTheme } = useContext(ThemeContext);
  const [isVisible, setIsVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setResults([]);

    try {
      const response = await fetch(`http://localhost:5000/api/books?title=${encodeURIComponent(title)}`);
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      alert('Error searching for books.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App" style={{ textAlign: 'left' }}>
      <div className={`fade-in fade-delay-1 ${isVisible ? 'visible' : ''}`}>
        <nav className="navbar">
          <Link to="/">
            <img src={Logo} width={70} height={70} alt="" />
          </Link>
          <h1 className="main-title">Multi-Branch Library Management System</h1>
          <div className="top-right-buttons">
            <label className="switch">
              <input
                type="checkbox"
                checked={theme === 'dark'}
                onChange={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              />
              <span className="slider"></span>
            </label>
            <Link to="/admin">
              <button>Back</button>
            </Link>
          </div>
        </nav>
      </div>

      <div className={`fade-in fade-delay-2 ${isVisible ? 'visible' : ''}`}>
        <div className="add-book-page">
          <h2>Search for a Book</h2>

          <form onSubmit={handleSearch}>
            <div>
              <label>Title: </label>
              <input
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter book title"
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>

          <hr />

          <h3>Results:</h3>
          {results.length === 0 && !loading && <p>No results found.</p>}

          {results.length > 0 && (
            <table border="1" cellPadding="8" style={{ marginTop: '1rem', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>ISBN</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Publisher</th>
                  <th>Copies Owned</th>
                </tr>
              </thead>
              <tbody>
                {results.map((book, index) => (
                  <tr key={index}>
                    <td>{book.ISBN}</td>
                    <td>{book.Title}</td>
                    <td>{`${book.Author_Firstname} ${book.Author_Lastname}`}</td>
                    <td>{book.Publisher}</td>
                    <td>{book.Copies_Owned}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
