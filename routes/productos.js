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

// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM productos");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Crear un nuevo producto
router.post("/", async (req, res) => {
  const { nombre, descripcion, precio, cantidad_stock, categoria_id } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO productos (nombre, descripcion, precio, cantidad_stock, categoria_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [nombre, descripcion, precio, cantidad_stock, categoria_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Actualizar un producto
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, cantidad_stock, categoria_id } = req.body;
  try {
    const result = await pool.query(
      "UPDATE productos SET nombre = $1, descripcion = $2, precio = $3, cantidad_stock = $4, categoria_id = $5 WHERE id = $6 RETURNING *",
      [nombre, descripcion, precio, cantidad_stock, categoria_id, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Eliminar un producto
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM productos WHERE id = $1", [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
