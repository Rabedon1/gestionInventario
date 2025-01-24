const express = require("express");
const router = express.Router();
const { Pool } = require("pg");
require("dotenv").config();

// Configurar conexión a la base de datos
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Obtener todas las categorías
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM categorias");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Crear una nueva categoría
router.post("/", async (req, res) => {
  const { nombre, descripcion } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO categorias (nombre, descripcion) VALUES ($1, $2) RETURNING *",
      [nombre, descripcion]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Actualizar una categoría
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;
  try {
    const result = await pool.query(
      "UPDATE categorias SET nombre = $1, descripcion = $2 WHERE id = $3 RETURNING *",
      [nombre, descripcion, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Eliminar una categoría
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM categorias WHERE id = $1", [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
