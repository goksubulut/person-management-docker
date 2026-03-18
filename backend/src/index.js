const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db");

const app = express();

const PORT = process.env.PORT || 5070;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

app.use(cors());
app.use(express.json());

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");

    res.status(200).json({
      status: "ok",
      database: "connected",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      database: "disconnected",
    });
  }
});

app.get("/api/people", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM people ORDER BY id ASC");
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "SERVER_ERROR" });
  }
});

app.get("/api/people/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("SELECT * FROM people WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "PERSON_NOT_FOUND" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "SERVER_ERROR" });
  }
});

app.post("/api/people", async (req, res) => {
  try {
    const { full_name, email } = req.body;

    if (!full_name || !email) {
      return res.status(400).json({ error: "VALIDATION_ERROR" });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "INVALID_EMAIL_FORMAT" });
    }

    const result = await pool.query(
      "INSERT INTO people (full_name, email) VALUES ($1, $2) RETURNING *",
      [full_name.trim(), email.trim().toLowerCase()]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ error: "EMAIL_ALREADY_EXISTS" });
    }

    res.status(500).json({ error: "SERVER_ERROR" });
  }
});

app.put("/api/people/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email } = req.body;

    if (!full_name || !email) {
      return res.status(400).json({ error: "VALIDATION_ERROR" });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "INVALID_EMAIL_FORMAT" });
    }

    const existing = await pool.query("SELECT * FROM people WHERE id = $1", [id]);

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "PERSON_NOT_FOUND" });
    }

    const result = await pool.query(
      "UPDATE people SET full_name = $1, email = $2 WHERE id = $3 RETURNING *",
      [full_name.trim(), email.trim().toLowerCase(), id]
    );

    res.status(200).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ error: "EMAIL_ALREADY_EXISTS" });
    }

    res.status(500).json({ error: "SERVER_ERROR" });
  }
});

app.delete("/api/people/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM people WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "PERSON_NOT_FOUND" });
    }

    res.status(200).json({ message: "PERSON_DELETED" });
  } catch (error) {
    res.status(500).json({ error: "SERVER_ERROR" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});