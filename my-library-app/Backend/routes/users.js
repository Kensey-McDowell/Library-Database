// backend/routes/users.js
import express from "express";
import { db } from "../db.js";

const router = express.Router();

router.get("/", (req, res) => {
  const sql = "SELECT * FROM LOGIN";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ error: "Failed to load users" });
    }

    res.json(results);
  });
});

router.post("/", (req, res) => {
  const { MemberName, Email, MemberPass } = req.body;

  const sql = `
    INSERT INTO LOGIN (MemberName, Email, MemberPass)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [MemberName, Email, MemberPass], (err, result) => {
    if (err) {
      console.error("Error adding user:", err);
      return res.status(500).json({ error: "Failed to add user" });
    }

    res.status(201).json({ message: "User added!" });
  });
});

export default router;