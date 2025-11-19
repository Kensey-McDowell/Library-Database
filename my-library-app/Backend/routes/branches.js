// backend/routes/branches.js
import express from "express";
import { db } from "../db.js";

const router = express.Router();

router.get("/", (req, res) => {
  const sql = "SELECT * FROM LIBRARY_BRANCH";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching branches:", err);
      return res.status(500).json({ error: "Failed to load branches" });
    }

    res.json(results);
  });
});

router.post("/", (req, res) => {
  const { BranchName, Address } = req.body;

  const sql = `
    INSERT INTO LIBRARY_BRANCH (BranchName, Address)
    VALUES (?, ?)
  `;

  db.query(sql, [BranchName, Address], (err, result) => {
    if (err) {
      console.error("Error adding branch:", err);
      return res.status(500).json({ error: "Failed to add branch" });
    }

    res.status(201).json({ message: "Branch added!" });
  });
});

export default router;