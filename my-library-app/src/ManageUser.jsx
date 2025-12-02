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
    MemberPass: "",
    Role_Code: "M",
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const loadUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Could not fetch users:", error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("User added.");
        setFormData({ MemberName: "", Email: "", MemberPass: "", Role_Code: "M" });
        loadUsers();
      } else {
        const errorData = await res.json();
        alert("Error adding user: " + (errorData.error || "Server failure."));
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Network error: Could not connect to user API.");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    await fetch(`http://localhost:5000/api/users/${id}`, {
      method: "DELETE",
    });

    loadUsers();
  };

  const getRoleName = (code) => {
    switch (code) {
      case 'A': return 'Admin';
      case 'E': return 'Employee';
      case 'M': return 'Member';
      default: return 'Unknown';
    }
  };

  return (
    <div className="App" style={{ textAlign: "left" }}>
      <div className={`fade-in fade-delay-1 ${isVisible ? "visible" : ""}`}>
        <nav className="navbar">
          <Link to="/" style={{ textDecoration: 'none' }}>
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

            <Link to="/admin" style={{ textDecoration: 'none' }}>
              <button>Back</button>
            </Link>
          </div>
        </nav>
      </div>

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
              <label>Password:</label>
              <input name="MemberPass" type="password" value={formData.MemberPass} onChange={handleChange} required />
            </div>

            <div>
              <label>User Role:</label>
              <select
                name="Role_Code"
                value={formData.Role_Code}
                onChange={handleChange}
                required
              >
                <option value="M">Member</option>
                <option value="E">Employee</option>
                <option value="A">Admin</option>
              </select>
            </div>

            <button type="submit">Add User</button>
          </form>

          <h2>Existing Users</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.Email}>
                  <td>{user.MemberName}</td>
                  <td>{user.Email}</td>
                  <td>{getRoleName(user.Role_Code)}</td>
                  <td>
                    <button
                      onClick={() => handleDeleteUser(user.MemberID)}
                      style={{backgroundColor: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer'}}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}