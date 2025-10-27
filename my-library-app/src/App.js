import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useContext, createContext } from "react";
import AdminDashboard from './AdminDashboard';
import Logo from './assets/MBLS_Logo.png';
import Main from './assets/Main_Library.png';
import Hadley from './assets/Hadley_Park.png';
import Green from './assets/Green_Hills.png';
import Donelson from './assets/Donelson.png';
import Edgehill from './assets/Edgehill.png';
import Bordeaux from './assets/Bordeaux.png';
import Inglewood from './assets/Inglewood.png';
import Richland from './assets/Richland_Park.png';
import Hermitage from './assets/Hermitage.png';
import Thompson from './assets/Thompson_Lane.png';
import user_icon from './assets/people.png';
import password_icon from './assets/passai.png';
import email_icon from './assets/emailai.png';
import "./App.css";

export const ThemeContext = createContext();

function Book({ title, route }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    const book = e.currentTarget;
    const rect = book.getBoundingClientRect();

    // Clone the book and inherit all CSS
    const clone = book.cloneNode(true);
    clone.classList.add("book-clone");
    clone.className = book.className; // inherit .book and children styles

    // Position clone over the original book
    clone.style.position = "fixed";
    clone.style.left = rect.left + "px";
    clone.style.top = rect.top + "px";
    clone.style.margin = 0;
    clone.style.zIndex = 9999;
    clone.style.transformOrigin = "center center";
    clone.style.transformStyle = "preserve-3d";
    clone.style.backfaceVisibility = "hidden";
    clone.style.overflow = "hidden";
    clone.style.transition = "transform 1s ease-in-out";
    clone.style.visibility = "visible"; // front cover shows immediately

    // Hide inner pages/back initially
    const clonePages = clone.querySelector(".pages");
    if (clonePages) clonePages.style.visibility = "hidden";

    const cloneBack = clone.querySelector(".back");
    if (cloneBack) cloneBack.style.visibility = "hidden";

    // Append clone first
    document.body.appendChild(clone);

    // Hide the original book now
    book.style.visibility = "hidden";
    document.body.style.overflow = "hidden";

    // Calculate center offsets for zoom
    const bookCenterX = rect.left + rect.width / 2;
    const bookCenterY = rect.top + rect.height / 2;
    const windowCenterX = window.innerWidth / 2;
    const windowCenterY = window.innerHeight / 2 + 40; // navbar offset
    const translateX = windowCenterX - bookCenterX;
    const translateY = windowCenterY - bookCenterY;

    // Step 1: reveal pages/back cover & start opening the front
    setTimeout(() => {
      if (clonePages) clonePages.style.visibility = "visible";
      if (cloneBack) cloneBack.style.visibility = "visible";

      clone.classList.add("open"); // front cover rotates smoothly via CSS
    }, 50);

    // Step 2: zoom/translate clone after cover starts opening
    setTimeout(() => {
      const scale = 16; // adjust as needed to fill screen
      clone.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale}) perspective(1000px) rotateY(-15deg)`;
    }, 600); // wait a bit for cover to start opening

    // Step 3: fade to white overlay after zoom
    setTimeout(() => {
      const overlay = document.createElement("div");
      overlay.style.position = "fixed";
      overlay.style.top = 0;
      overlay.style.left = 0;
      overlay.style.width = "100vw";
      overlay.style.height = "100vh";
      overlay.style.background = "white";
      overlay.style.zIndex = 10000;
      overlay.style.opacity = 0;
      overlay.style.transition = "opacity 0.5s ease";
      document.body.appendChild(overlay);

      requestAnimationFrame(() => (overlay.style.opacity = 1));

      setTimeout(() => {
        clone.remove();
        overlay.remove();
        document.body.style.overflow = "";
        navigate(route); // navigate after everything is cleaned up
      }, 500); // fade duration
    }, 1500);
  };

  return (
    <div className="book" onClick={handleClick}>
      <div className="cover front">
        <h3>{title}</h3>
      </div>
      <div className="pages"></div>
      <div className="cover back"></div>
    </div>
  );
}

function Home() {
  const { theme, setTheme } = useContext(ThemeContext);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomTransform, setZoomTransform] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300); // delay before fade-in

    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="App">
      <div className={`fade-in fade-delay-1 ${isVisible ? 'visible' : ''}`}>
        <nav className="navbar">
          <Link to="/">
            <img src={Logo} width={70} height={70} alt=''></img>
          </Link>
          <h1 className="main-title">Multi-Branch Library Management System</h1>
          <div className="top-right-buttons">
             <label className="switch">
            <input
              type="checkbox"
              checked={theme === "dark"}
              onChange={() =>
                setTheme(theme === "light" ? "dark" : "light")
              }
            />
            <span className="slider"></span>
          </label>
            <Link to="/SignUp">
              <button>Sign Up</button>
            </Link>
            <Link to="/Login">
              <button>Log In</button>
            </Link>
          </div>
        </nav>
        <div className="viewport" style={{ transform: isZooming ? zoomTransform : 'none', transition: 'transform 1s ease-in-out'}}>
        <div className={`fade-in fade-delay-2 ${isVisible ? 'visible' : ''}`}>
        <div className="bookshelf">
          <div className={`fade-in fade-delay-3 ${isVisible ? 'visible' : ''}`}>
          <h1>Welcome!</h1>
          </div>
          <div className={`fade-in fade-delay-4 ${isVisible ? 'visible' : ''}`}>
          <p>Please begin by selecting a library to browse it's catalog.</p>
          </div>
          <div className={`fade-in fade-delay-5 ${isVisible ? 'visible' : ''}`}>
          <div className="shelf-wrapper">
            <div className="book-row">
              <Book title="Main Library" route="/main" setIsZooming={setIsZooming} setZoomTransform={setZoomTransform}/>
              <Book title="Green Hills" route="/green" setIsZooming={setIsZooming} setZoomTransform={setZoomTransform}/>
              <Book title="Donelson" route="/donelson" setIsZooming={setIsZooming} setZoomTransform={setZoomTransform}/>
              <Book title="Hadley Park" route="/hadley" setIsZooming={setIsZooming} setZoomTransform={setZoomTransform}/>
              <Book title="Edgehill" route="/edgehill" setIsZooming={setIsZooming} setZoomTransform={setZoomTransform}/>
            </div>
            <div className="shelf"></div>
          </div>
          <div className="shelf-wrapper">
            <div className="book-row second-row">
              <Book title="Bordeaux" route="/bordeaux" setIsZooming={setIsZooming} setZoomTransform={setZoomTransform}/>
              <Book title="Inglewood" route="/inglewood" setIsZooming={setIsZooming} setZoomTransform={setZoomTransform}/>
              <Book title="Richland Park" route="/richland" setIsZooming={setIsZooming} setZoomTransform={setZoomTransform}/>
              <Book title="Hermitage" route="/hermitage" setIsZooming={setIsZooming} setZoomTransform={setZoomTransform}/>
              <Book title="Thompson Lane" route="/thompson" setIsZooming={setIsZooming} setZoomTransform={setZoomTransform}/>
            </div>
            <div className="shelf"></div>
          </div>
          </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

function LibraryPage({ name }) {
  const { theme, setTheme } = useContext(ThemeContext);
  const [isVisible, setIsVisible] = useState(false);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Effect for API Data Fetching
  useEffect(() => {
    const fetchBookData = async () => {
        const API_URL = 'http://localhost:5000/api/books';

        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            // Success Check (Prints to Browser Console - F12)
            console.log(`--- API Connection Successful! (Branch: ${name}) ---`);
            console.log("Data Received from Flask Backend:", data);

            setBooks(data.books || []);

        } catch (err) {
            console.error("Connection Error (Check Flask Server/CORS):", err);
            setError("Failed to fetch data. Ensure Flask server is running on port 5000.");
        } finally {
            setLoading(false);
        }
    };

    fetchBookData();
  }, [name]); // Re-run fetch if the branch name changes

  let imageElement = null;
  if (name === 'Main Library') {
    imageElement = <img src={Main} width={800} height={400} alt='' style={{border: '1px solid #ccc'}} />;
  }
  else if(name === 'Green Hills') {
    imageElement = <img src={Green} width={800} height={400} alt='' style={{border: '1px solid #ccc'}} />;
  }
  else if(name === 'Donelson') {
    imageElement = <img src={Donelson} width={800} height={400} alt='' style={{border: '1px solid #ccc'}} />;
  }
  else if(name === 'Hadley Park') {
    imageElement = <img src={Hadley} width={800} height={400} alt='' style={{border: '1px solid #ccc'}} />;
  }
  else if(name === 'Edgehill') {
    imageElement = <img src={Edgehill} width={800} height={400} alt='' style={{border: '1px solid #ccc'}} />;
  }
  else if(name === 'Bordeaux') {
    imageElement = <img src={Bordeaux} width={800} height={400} alt='' style={{border: '1px solid #ccc'}} />;
  }
  else if(name === 'Inglewood') {
    imageElement = <img src={Inglewood} width={800} height={400} alt='' style={{border: '1px solid #ccc'}} />;
  }
  else if(name === 'Richland Park') {
    imageElement = <img src={Richland} width={800} height={400} alt='' style={{border: '1px solid #ccc'}} />;
  }
  else if(name === 'Hermitage') {
    imageElement = <img src={Hermitage} width={800} height={400} alt='' style={{border: '1px solid #ccc'}} />;
  }
  else if(name === 'Thompson Lane') {
    imageElement = <img src={Thompson} width={800} height={400} alt='' style={{border: '1px solid #ccc'}} />;
  }

  // Content for the Book Catalog section
  let catalogContent;
  if (loading) {
    catalogContent = <div style={{padding: '10px', textAlign: 'center', fontSize: '18px', color: 'white'}}>Loading catalog...</div>;
  } else if (error) {
    catalogContent = <div style={{padding: '10px', textAlign: 'center', color: 'white', border: '1px solid white', borderRadius: '5px'}}>{error}</div>;
  } else {
    catalogContent = (
      <div style={{marginTop: '15px'}}>
        <h3 style={{fontSize: '16px', fontWeight: 'bold', marginBottom: '10px'}}>Available Books ({books.length})</h3>
        {books.length > 0 ? (
          <p style={{fontSize: '14px', color: 'white'}}>Successfully fetched {books.length} records. **Connection Verified!**</p>
        ) : (
          <p style={{fontSize: '14px', color: 'white'}}>No books found in the current catalog. (Check your MySQL data)</p>
        )}
        {/* Simple list of fetched books */}
        <div style={{ maxHeight: '200px', overflowY: 'auto', marginTop: '10px', border: '1px solid #ccc', padding: '5px' }}>
            {books.slice(0, 5).map((book, index) => (
                <div key={index} style={{ fontSize: '12px', borderBottom: '1px dotted #ccc', padding: '3px 0' }}>
                    {/* FIX: Use Title and Author_Firstname + Author_Lastname */}
                    **{book.Title}** by {book.Author_Firstname} {book.Author_Lastname} (ISBN: {book.ISBN})
                </div>
            ))}
            {books.length > 5 && <div style={{ fontSize: '12px', color: '#888' }}>... and {books.length - 5} more books.</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="App">
    <div className="library-page">
      <div className={`fade-in fade-delay-1 ${isVisible ? 'visible' : ''}`}>
        <nav className="navbar">
          <Link to="/">
            <img src={Logo} width={70} height={70} alt=''></img>
          </Link>
          <h1 className="main-title">Multi-Branch Library Management System</h1>
          <div className="top-right-buttons">
            <label className="switch">
              <input
                type="checkbox"
                checked={theme === "dark"}
                onChange={() =>
                  setTheme(theme === "light" ? "dark" : "light")
                }
              />
              <span className="slider"></span>
            </label>
            <Link to="/SignUp">
              <button>Sign Up</button>
            </Link>
            <Link to="/Login">
              <button>Log In</button>
            </Link>
          </div>
        </nav>
        <div className={`fade-in fade-delay-2 ${isVisible ? 'visible' : ''}`}>
          <div className="Info-box">
          <div  style={{ display: 'flex', alignItems: 'flex-start', gap: '40px' }}>
            <div>{imageElement}</div>
            <div>
              <h2 className={`fade-in fade-delay-3 ${isVisible ? 'visible' : ''}`}>{name}</h2>
              <p className={`fade-in fade-delay-4 ${isVisible ? 'visible' : ''}`}>
                Welcome to the {name} branch!
              </p>
              {catalogContent}
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

function SignUpPage() {
  const { theme, setTheme } = useContext(ThemeContext);
  const [isVisible, setIsVisible] = useState(false);


  const [action, setAction] = useState("Sign Up");


  const [formData, setFormData] = useState({
    MemberName: "",
    Email: "",
    MemberPass: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("User registered successfully.");
        setFormData({ MemberName: "", Email: "", MemberPass: "" });
      } else {
        setMessage(result.error || "Signup failed.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setMessage("Could not connect to backend. Make sure Flask is running.");
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="App">
    <div className="SignUp">
      <div className={`fade-in fade-delay-1 ${isVisible ? "visible" : ""}`}>
        <nav className="navbar">
          <Link to="/">
            <img src={Logo} width={70} height={70} alt="" />
          </Link>
          <h1 className="main-title">
            Multi-Branch Library Management System
          </h1>
          <div className="top-right-buttons">
            <label className="switch">
              <input
                type="checkbox"
                checked={theme === "dark"}
                onChange={() => setTheme(theme === "light" ? "dark" : "light")}
              />
              <span className="slider"></span>
            </label>
          </div>
        </nav>

        <div className={`fade-in fade-delay-2 ${isVisible ? "visible" : ""}`}>
          <form className="container" onSubmit={handleSubmit}>
            <div className="header">
              <div className="text">{action}</div>
              <div className="underline"></div>
            </div>

            <div className="inputs">
              {action === "Login" ? null : (
                <div className="input">
                  <img src={user_icon} width={38} height={23} alt="" />
                  <input
                    type="text"
                    name="MemberName"
                    placeholder="Name"
                    value={formData.MemberName}
                    onChange={handleChange}
                    required={action === "Sign Up"}
                  />
                </div>
              )}

              <div className="input">
                <img src={email_icon} width={38} height={23} alt="" />
                <input
                  type="email"
                  name="Email"
                  placeholder="Email"
                  value={formData.Email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input">
                <img src={password_icon} width={38} height={23} alt="" />
                <input
                  type="password"
                  name="MemberPass"
                  placeholder="Password"
                  value={formData.MemberPass}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {action === "Login" ? (
              <div className="forgot-password">
                Lost Password? <span>Click Here</span>
              </div>
            ) : null}

            <div className="submit-container">
              <div
                className={action === "Login" ? "submit gray" : "submit"}
                onClick={() => setAction("Sign Up")}
              >
                Sign Up
              </div>

              <div
                className={action === "Sign Up" ? "submit gray" : "submit"}
                onClick={() =>
                  action === "Login" ? navigate("/Login") : setAction("Login")
                }
              >
                Login
              </div>
            </div>

            {action === "Sign Up" && (
              <div className="submit-only-container">
                <button
                  type="submit"
                  className="submit"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Submit"}
                </button>
              </div>
            )}

            {message && (
              <p style={{ color: "white", marginTop: "10px" }}>{message}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  </div>
);
}


function LoginPage(){
  const { theme, setTheme } = useContext(ThemeContext);
  const [isVisible, setIsVisible] = useState(false);
  const [action, setAction] = useState("Login");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="App">
      <div className={`fade-in fade-delay-1 ${isVisible ? 'visible' : ''}`}>
      <nav className="navbar">
        <Link to="/">
          <img src={Logo} width={70} height={70} alt=''></img>
        </Link>
        <h1 className="main-title">Multi-Branch Library Management System</h1>
        <div className="top-right-buttons">
          <label className="switch">
              <input
                type="checkbox"
                checked={theme === "dark"}
                onChange={() =>
                  setTheme(theme === "light" ? "dark" : "light")
                }
              />
              <span className="slider"></span>
            </label>
        </div>
      </nav>
      <Link to="/admin">
      <button>Admin</button>
      </Link>
      <div className={`fade-in fade-delay-2 ${isVisible ? 'visible' : ''}`}>
      <div className='container'>
        <div className="header">
          <div className="text">{action}</div>
          <div className="underline"></div>
        </div>
        <div className="inputs">
            {action==="Login" ? null : <div className="input">
            <img src={user_icon} width={38} height={23} alt="" />
            <input type="text" placeholder="Name" />
          </div>}

          <div className="input">
            <img src={email_icon} width={38} height={23} alt="" />
            <input type="email" placeholder="Email" />
          </div>
          <div className="input">
            <img src={password_icon} width={38} height={23} alt="" />
            <input type="password" placeholder="Password" />
          </div>
        </div>
        {action==="Sign Up" ? <div></div> : <div className="forgot-password">Lost Password? <span> Click Here! </span> </div> }
        <div className="submit-container">
          <div className={action==="Login"?"submit gray":"submit"} onClick={()=>{setAction("Sign Up")}}>Sign Up</div>
          <div className={action==="Sign Up"?"submit gray":"submit"} onClick={()=>{setAction("Login")}}>Login</div>
        </div>
      </div>
      </div>
      </div>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/SignUp" element={<SignUpPage name="Sign-Up"/>} />
          <Route path="/Login" element={<LoginPage name="Login"/>} />
          <Route path="/main" element={<LibraryPage name="Main Library"/>} />
          <Route path="/green" element={<LibraryPage name="Green Hills"/>} />
          <Route path="/donelson" element={<LibraryPage name="Donelson"/>} />
          <Route path="/hadley" element={<LibraryPage name="Hadley Park"/>} />
          <Route path="/edgehill" element={<LibraryPage name="Edgehill"/>} />
          <Route path="/bordeaux" element={<LibraryPage name="Bordeaux"/>} />
          <Route path="/inglewood" element={<LibraryPage name="Inglewood"/>} />
          <Route path="/richland" element={<LibraryPage name="Richland Park"/>} />
          <Route path="/hermitage" element={<LibraryPage name="Hermitage"/>} />
          <Route path="/thompson" element={<LibraryPage name="Thompson Lane"/>} />
        </Routes>
      </Router>
    </ThemeContext.Provider>
  );
}
