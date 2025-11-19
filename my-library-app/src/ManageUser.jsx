import { Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import Logo from "./assets/MBLS_Logo.png";
import { ThemeContext } from "./App";
import "./App.css";
import "./ManageUser.css";

export default function ManageUsersPage() {
  const { theme, setTheme } = useContext(ThemeContext);
  const [isVisible, setIsVisible] = useState(false);

  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    MemberName: "",
    Email: "",
    MemberPass: ""
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Fetch all users
  const loadUsers = async () => {
    const res = await fetch("http://localhost:5000/api/users");
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert("User added.");
      setFormData({ MemberName: "", Email: "", MemberPass: ""});
      loadUsers();
    } else {
      alert("Error adding user.");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    await fetch(`http://localhost:5000/api/users/${id}`, {
      method: "DELETE",
    });

    loadUsers();
  };

  return (
    <div className="App" style={{ textAlign: "left" }}>
      {/* NAVBAR */}
      <div className={`fade-in fade-delay-1 ${isVisible ? "visible" : ""}`}>
        <nav className="navbar">
          <Link to="/">
            <img src={Logo} width={70} height={70} alt="" />
          </Link>

          <h1 className="main-title">Manage Users</h1>

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

      {/* USERS CONTENT */}
      <div className={`fade-in fade-delay-2 ${isVisible ? "visible" : ""}`}>
        <div className="manage-users-page">

          <h2>Add New User</h2>
          <form onSubmit={handleAddUser}>
            <div>
              <label>Name:</label>
              <input name="MemberName" value={formData.MemberName} onChange={handleChange} required />
            </div>

            <div>
              <label>Email:</label>
              <input name="Email" value={formData.Email} onChange={handleChange} required />
            </div>

            <div>
              <label>Member Password:</label>
              <input name="MemberPass" value={formData.MemberPass} onChange={handleChange} required />
            </div>

            <button type="submit">Add User</button>
          </form>

          <h2>Existing Users</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th><th>Email</th>
              </tr>
            </thead>

            <tbody>
              {users.map((b) => (
                <tr key={b.MemberName}>
                  <td>{b.MemberName}</td>
                  <td>{b.Email}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}
