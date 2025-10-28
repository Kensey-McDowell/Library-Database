import { useState } from "react";
import './bookadd.css';

export default function AddBookPage() {
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
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
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
            value={formData.Page_Count}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Copies Owned: </label>
          <input
            name="Copies_Owned"
            type="number"
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
  );
}
