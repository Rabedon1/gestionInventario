const express = require("express");
const router = express.Router();
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Obtener todos los clientes
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM clientes");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Crear un nuevo cliente
router.post("/", async (req, res) => {
  const { nombre, apellido, email, telefono } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO clientes (nombre, apellido, email, telefono) VALUES ($1, $2, $3, $4) RETURNING *",
      [nombre, apellido, email, telefono]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Actualizar un cliente
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, email, telefono } = req.body;
  try {
    const result = await pool.query(
      "UPDATE clientes SET nombre = $1, apellido = $2, email = $3, telefono = $4 WHERE id = $5 RETURNING *",
      [nombre, apellido, email, telefono, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Eliminar un cliente
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM clientes WHERE id = $1", [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
