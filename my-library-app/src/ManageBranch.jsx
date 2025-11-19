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
    LIBRARY_BRANCHId: "",
    Name: "",
    Address: "",
    City: "",
    Phone_Number: "",
    Email_Address: "",
    Num_Member: 0
  });

  const [editingBranch, setEditingBranch] = useState(null); 

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
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? parseInt(value) : value
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
        setFormData({ Name: "", Address: "", City: "", Phone_Number: "", Email_Address: "", Num_Member: "", LIBRARY_BRANCHId: ""});
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
        setFormData({ Name: "", Address: "", City: "", Phone_Number: "", Email_Address: "", Num_Member: "", LIBRARY_BRANCHId: "" });
        loadBranches();
      } else {
        alert("Error adding branch.");
      }
    }
  };

  // Load branch into form to edit
  const handleEdit = (branch) => {
    setEditingBranch(branch.LIBRARY_BRANCHId);
    setFormData({
      Name: branch.Name,
      Address: branch.Address,
      City: branch.City,
      Phone_Number: branch.Phone_Number,
      Email_Address: branch.Email_Address,
      Num_Member: branch.Num_Member,
      LIBRARY_BRANCHId: branch.LIBRARY_BRANCHId
    });
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
                name="Name"
                value={formData.Name}
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
              <label>City:</label>
              <input
                name="City"
                value={formData.City}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Phone Number:</label>
              <input
                type="text"
                name="Phone_Number"
                value={formData.Phone_Number}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Email Address:</label>
              <input
                name="Email_Address"
                value={formData.Email_Address}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Number of Members:</label>
              <input
                type="number"
                name="Num_Member"
                value={formData.Num_Member}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Branch ID:</label>
              <input
                type="number"
                name="LIBRARY_BRANCHId"
                value={formData.LIBRARY_BRANCHId}
                onChange={handleChange}
                required
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
                  setFormData({ Name: "", Address: "", City: "", Phone_Number: "", Email_Address: "", Num_Member: "", LIBRARY_BRANCHId: "" });
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
                <th>Name</th>
                <th>Address</th>
                <th>City</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Members</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {branches.map((b) => (
                <tr key={b.LIBRARY_BRANCHId}>
                  <td>{b.Name}</td>
                  <td>{b.Address}</td>
                  <td>{b.City}</td>
                  <td>{b.Phone_Number}</td>
                  <td>{b.Email_Address}</td>
                  <td>{b.Num_Member}</td>

                  <td>
                    <button onClick={() => handleEdit(b)}>Edit</button>
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