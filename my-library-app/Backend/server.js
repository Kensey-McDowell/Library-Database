import express from "express";
import cors from "cors";
import booksRouter from "./routes/books.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/books", booksRouter);

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));