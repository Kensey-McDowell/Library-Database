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
      <div class="centered-box">
        <div className="featured">
          <div className='alt-wrapper'>
            <h1 className='alt-title'>Featured Reads</h1>
          </div>
          <div className="featured-details"></div>
        </div>

        <div className="recommendations">
          
        </div>
      </div>
    </div>
  );
}

export default App;
