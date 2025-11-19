import { Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import Logo from "./assets/MBLS_Logo.png";
import { ThemeContext } from "./App";
import "./App.css";
import "./ManageBranch.css";

export default function ManageBranchesPage() {
  const { theme, setTheme } = useContext(ThemeContext);
  const [isVisible, setIsVisible] = useState(false);

  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({
    Branch_Name: "",
    Address: "",
    Phone: "",
    IsActive: true
  });

  const [editingBranch, setEditingBranch] = useState(null); // For editing mode

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Load branches
  const loadBranches = async () => {
    const res = await fetch("http://localhost:5000/api/branches");
    const data = await res.json();
    setBranches(data);
  };

  useEffect(() => {
    loadBranches();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // Add or Update Branch
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingBranch) {
      // Update branch
      const res = await fetch(
        `http://localhost:5000/api/branches/${editingBranch}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        }
      );

      if (res.ok) {
        alert("Branch updated.");
        setEditingBranch(null);
        setFormData({ Branch_Name: "", Address: "", Phone: "", IsActive: true });
        loadBranches();
      } else {
        alert("Error updating branch.");
      }

    } else {
      // Add new branch
      const res = await fetch("http://localhost:5000/api/branches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert("Branch added.");
        setFormData({ Branch_Name: "", Address: "", Phone: "", IsActive: true });
        loadBranches();
      } else {
        alert("Error adding branch.");
      }
    }
  };

  // Load branch into form to edit
  const handleEdit = (branch) => {
    setEditingBranch(branch.Branch_ID);
    setFormData({
      Branch_Name: branch.Branch_Name,
      Address: branch.Address,
      Phone: branch.Phone,
      IsActive: branch.IsActive
    });
  };

  // Activate/deactivate branch
  const handleToggleActive = async (branch) => {
    const updated = { ...branch, IsActive: !branch.IsActive };

    await fetch(`http://localhost:5000/api/branches/${branch.Branch_ID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated)
    });

    loadBranches();
  };

  return (
    <div className="App" style={{ textAlign: "left" }}>
      <div className={`fade-in fade-delay-1 ${isVisible ? "visible" : ""}`}>
        <nav className="navbar">
          <Link to="/">
            <img src={Logo} width={70} height={70} alt="" />
          </Link>

          <h1 className="main-title">Manage Library Branches</h1>

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
      <div className={`fade-in fade-delay-2 ${isVisible ? "visible" : ""}`}>
        <div className="manage-branches-page">

          <h2>{editingBranch ? "Edit Branch" : "Add New Branch"}</h2>

          <form onSubmit={handleSubmit}>
            <div>
              <label>Branch Name:</label>
              <input
                name="Branch_Name"
                value={formData.Branch_Name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Address:</label>
              <input
                name="Address"
                value={formData.Address}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Phone:</label>
              <input
                name="Phone"
                value={formData.Phone}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Active:</label>
              <input
                type="checkbox"
                name="IsActive"
                checked={formData.IsActive}
                onChange={handleChange}
              />
            </div>

            <button type="submit">
              {editingBranch ? "Save Changes" : "Add Branch"}
            </button>

            {editingBranch && (
              <button
                type="button"
                onClick={() => {
                  setEditingBranch(null);
                  setFormData({
                    Branch_Name: "",
                    Address: "",
                    Phone: "",
                    IsActive: true
                  });
                }}
              >
                Cancel Edit
              </button>
            )}
          </form>

          <h2>Existing Branches</h2>

          <table>
            <thead>
              <tr>
                <th>Name</th><th>Address</th><th>Phone</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {branches.map((b) => (
                <tr key={b.Branch_ID}>
                  <td>{b.Branch_Name}</td>
                  <td>{b.Address}</td>
                  <td>{b.Phone}</td>
                  <td>{b.IsActive ? "Active" : "Inactive"}</td>

                  <td>
                    <button onClick={() => handleEdit(b)}>Edit</button>
                    <button onClick={() => handleToggleActive(b)}>
                      {b.IsActive ? "Deactivate" : "Activate"}
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