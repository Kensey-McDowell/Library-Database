// backend/routes/books.js
import express from "express";
import { db } from "../db.js";

const router = express.Router();

router.post("/", (req, res) => {
  const {
    ISBN,
    Title,
    Author_Last_Name,
    Author_First_Name,
    Date_Published,
    Publisher,
    IsPaperBack,
    Page_Count,
    Copies_Owned,
    Borrower_ID,
    Library_Branch_ID
  } = req.body;

  const sql = `
    INSERT INTO BOOK (
      ISBN, Title, Author_Lastname, Author_Firstname,
      Date_Published, Publisher, IsPaperBack,
      Page_Count, Copies_Owned, BORROWER, Book_Library
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      ISBN,
      Title,
      Author_Last_Name,
      Author_First_Name,
      Date_Published,
      Publisher,
      IsPaperBack,
      Page_Count,
      Copies_Owned,
      Borrower_ID,
      Library_Branch_ID
    ],
    (err, result) => {
      if (err) {
        console.error("Error inserting book:", err);
        return res.status(500).json({ error: "Failed to add book" });
      }

      console.log("Book added successfully:", result);
      res.status(201).json({ message: "Book added successfully!" });
    }
  );
});

export default router;
