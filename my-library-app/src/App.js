import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
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
import "./App.css";

function Book({ title, route, setIsZooming, setZoomTransform }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    const book = e.currentTarget;
    const rect = book.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const offsetX = window.innerWidth /2 - centerX;
    const offsetY = window.innerHeight / 2 - centerY;

    setZoomTransform(`translate(${offsetX}px, ${offsetY}px) scale(15)`);
    setIsZooming(true);

    book.classList.add("open");

    setTimeout(() => {
      navigate(route);
    }, 3000);
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
  const [isZooming, setIsZooming] = useState(false);
  const [zoomTransform, setZoomTransform] = useState('');
  return (
    <div className="App">
      <div className="viewport" style={{ transform: isZooming ? zoomTransform : 'none', 
      transition: 'transform 1s ease-in-out', transformOrigin: 'center center',}}>
        <nav className="navbar">
          <Link to="/">
            <img src={Logo} width={70} height={70} alt=''></img>
          </Link>
          <h1 className="main-title">Multi-Branch Library Management System</h1>
          <div className="top-right-buttons">
            <Link to="/SignUp">
              <button>Sign Up</button>
            </Link>
            <Link to="/Login">
              <button>Log In</button>
            </Link>
          </div>
        </nav>
        <div className="bookshelf">
          <h1>Welcome!</h1>
          <p>Please begin by selecting a library to browse it's catalog.</p>
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
  );
}

function LibraryPage({ name }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300); // delay before fade-in

    return () => clearTimeout(timer);
  }, []);

  let imageElement = null;
  if (name === 'Main Library') {
    imageElement = <img src={Main} width={800} height={400} alt='' />;
  }
  else if(name === 'Green Hills') {
    imageElement = <img src={Green} width={800} height={400} alt='' />;
  }
  else if(name === 'Donelson') {
    imageElement = <img src={Donelson} width={800} height={400} alt='' />;
  }
  else if(name === 'Hadley Park') {
    imageElement = <img src={Hadley} width={800} height={400} alt='' />;
  }
  else if(name === 'Edgehill') {
    imageElement = <img src={Edgehill} width={800} height={400} alt='' />;
  }
  else if(name === 'Bordeaux') {
    imageElement = <img src={Bordeaux} width={800} height={400} alt='' />;
  }
  else if(name === 'Inglewood') {
    imageElement = <img src={Inglewood} width={800} height={400} alt='' />;
  }
  else if(name === 'Richland Park') {
    imageElement = <img src={Richland} width={800} height={400} alt='' />;
  }
  else if(name === 'Hermitage') {
    imageElement = <img src={Hermitage} width={800} height={400} alt='' />;
  }
  else if(name === 'Thompson Lane') {
    imageElement = <img src={Thompson} width={800} height={400} alt='' />;
  }

  return (
    <div className="library-page">
      <div className={`page-body fade-in ${isVisible ? 'visible' : ''}`}>
        <nav className="navbar">
          <Link to="/">
            <img src={Logo} width={70} height={70} alt=''></img>
          </Link>
          <h1 className="main-title">Multi-Branch Library Management System</h1>
          <div className="top-right-buttons">
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
          <div  style={{ display: 'flex', alignItems: 'center' }}>
            <div>{imageElement}</div>
            <div>
              <h2 className={`fade-in fade-delay-2 ${isVisible ? 'visible' : ''}`}>{name}</h2>
              <p className={`fade-in fade-delay-3 ${isVisible ? 'visible' : ''}`}>
                Welcome to the {name} branch!
              </p>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SignUpPage(){
  return (
    <div className="Sign-Up">
      <p>Sign Up page here</p>
    </div>
  );
}

function LoginPage(){
  return (
    <div className="Login">
      <p>Login page here</p>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/SignUp" element={<SignUpPage name ="Sign-Up"/>} />
        <Route path="/Login" element={<LoginPage name ="Login"/>} />
        <Route path="/main" element={<LibraryPage name="Main Library" />} />
        <Route path="/green" element={<LibraryPage name="Green Hills" />} />
        <Route path="/donelson" element={<LibraryPage name="Donelson" />} />
        <Route path="/hadley" element={<LibraryPage name="Hadley Park" />} />
        <Route path="/edgehill" element={<LibraryPage name="Edgehill" />} />
        <Route path="/bordeaux" element={<LibraryPage name="Bordeaux" />} />
        <Route path="/inglewood" element={<LibraryPage name="Inglewood" />} />
        <Route path="/richland" element={<LibraryPage name="Richland Park" />} />
        <Route path="/hermitage" element={<LibraryPage name="Hermitage" />} />
        <Route path="/thompson" element={<LibraryPage name="Thompson Lane" />} />
      </Routes>
    </Router>
  );
}
