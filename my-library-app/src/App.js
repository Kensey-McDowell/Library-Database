import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <nav className="navbar">
        <div className="top-left-buttons">
          <button>Sign In</button>
          <button>Log In</button>
        </div>
        <header className="App-header">
          <h1 className="main-title">Multi-Branch Library Management System</h1>
        </header>
      </nav>
      <div className="centered-box">
        <div className="featured">
          <div className='alt-wrapper'>
            <h1 className='alt-title'>Featured Libraries</h1>
          </div>
          <div className="featured-details"></div>
        </div>

        <div className="recommendations">
        </div>
      </div>
      <div className="book-row">
        <div className="book-box"><div className="book-title">Main Library</div></div>
        <div className="book-box"><div className="book-title">Green Hills</div></div>
        <div className="book-box"><div className="book-title">Donelson</div></div>
        <div className="book-box"><div className="book-title">Hadley Park</div></div>
        <div className="book-box"><div className="book-title">Edgehill</div></div>
        <div className="book-box"><div className="book-title">Bordeaux</div></div>
      </div>
      <div className='shelf'></div>
    </div>
  );
}

export default App;
