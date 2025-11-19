import express from "express";
import cors from "cors";
import booksRouter from "./routes/books.js";
import usersRouter from "./routes/users.js";
import branchesRouter from "./routes/branches.js";
import bookSearchRoutes from "./routes/BookSearch.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/books", booksRouter);
app.use("/api/users", usersRouter);
app.use("/api/branches", branchesRouter);
app.use("/api", bookSearchRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));