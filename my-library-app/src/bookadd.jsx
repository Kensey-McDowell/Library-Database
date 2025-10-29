import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useContext } from "react";
import Logo from './assets/MBLS_Logo.png';
import './App.css';
import './bookadd.css';
import { ThemeContext } from './App';

export default function AddBookPage() {
  const { theme, setTheme } = useContext(ThemeContext);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300); // delay before fade-in
  
    return () => clearTimeout(timer);
  }, []);

  const [formData, setFormData] = useState({
    ISBN: "",
    Title: "",
    Author_Last_Name: "",
    Author_First_Name: "",
    Date_Published: "",
    Publisher: "",
    IsPaperBack: false,
    Page_Count: "",
    Copies_Owned: "",
    Borrower_ID: "",
    Library_Branch_ID: ""
  });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    let newValue = type === "checkbox" ? checked : value;

    if ((name === "Page_Count" || name === "Copies_Owned") && Number(newValue) < 0) {
    newValue = "0";
    }

    setFormData({
      ...formData,
      [name]: newValue,
    });

  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to add book");
      alert("Book added successfully!");

      // reset form
      setFormData({
        ISBN: "",
        Title: "",
        Author_Last_Name: "",
        Author_First_Name: "",
        Date_Published: "",
        Publisher: "",
        IsPaperBack: false,
        Page_Count: "",
        Copies_Owned: "",
        Borrower_ID: "",
        Library_Branch_ID: ""
      });
    } catch (err) {
      console.error(err);
      alert("Error adding book.");
    }
  };

  return (
    <div className="App" style={{textAlign: 'left'}}>
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
            <Link to="/admin">
              <button>Back</button>
            </Link>
          </div>
        </nav>
        </div>
        <div className={`fade-in fade-delay-2 ${isVisible ? 'visible' : ''}`}>
        <div className="add-book-page">
          <h2>Add a New Book</h2>
          <form onSubmit={handleSubmit}>

            <div>
            <label>ISBN: </label>
            <input
              name="ISBN"
              value={formData.ISBN}
              onChange={handleChange}
              required
            />
            </div>

            <div>
              <label>Title: </label>
              <input
                name="Title"
                value={formData.Title}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Author Last Name: </label>
              <input
                name="Author_Last_Name"
                value={formData.Author_Last_Name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Author First Name: </label>
              <input
                name="Author_First_Name"
                value={formData.Author_First_Name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Date Published: </label>
              <input
                name="Date_Published"
                value={formData.Date_Published}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Publisher: </label>
              <input
                name="Publisher"
                value={formData.Publisher}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Paperback: </label>
              <input
                type="checkbox"
                name="IsPaperBack"
                checked={formData.IsPaperBack}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Page Count:</label>
              <input
                name="Page_Count"
                type="number"
                min="0"
                value={formData.Page_Count}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Copies Owned: </label>
              <input
                name="Copies_Owned"
                type="number"
                min="0"
                value={formData.Copies_Owned}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Borrower ID: </label>
              <input
                name="Borrower_ID"
                value={formData.Borrower_ID}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Library Branch ID: </label>
              <input
                name="Library_Branch_ID"
                value={formData.Library_Branch_ID}
                onChange={handleChange}
              />
            </div>

            <button type="submit">Add Book</button>
          </form>
        </div>
        </div>
    </div>
  );
}
