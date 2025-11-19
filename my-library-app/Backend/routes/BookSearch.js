// backend/routes/BookSearch.js
import express from "express";
import { db } from "../db.js";

const router = express.Router();
/*

book.ISBN
book.Title
book.Author_Firstname , book.Author_Lastname
book.Publisher
book.Copies_Owned

 */
router.get('/books', async (req, res) => {
    const title = req.query.title;

    if(!title){
        return res.status(400).json({ error: "Missing 'title'" });
    }

    try {
        const sql = `

            SELECT book.ISBN,
                   book.Title,
                   book.Author_Firstname,
                   book.Author_Lastname,
                   book.Publisher,
                   book.Copies_Owned

            FROM book

            WHERE book.Title LIKE ?

        `;

        const PromiseDb = db.promise();

        const [rows] = await PromiseDb.query(sql, [`%${title}%`]);
        res.json(rows);

    }
    catch(err){
        console.error("Failed to search books:", err);
    }

    console.log("Book Searched Successfully:");
})

export default router;