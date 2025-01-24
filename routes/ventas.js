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

// Obtener todas las ventas
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM ventas");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Crear una nueva venta
router.post("/", async (req, res) => {
  const { producto_id, cantidad, fecha_venta, total } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO ventas (producto_id, cantidad, fecha_venta, total) VALUES ($1, $2, $3, $4) RETURNING *",
      [producto_id, cantidad, fecha_venta, total]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Actualizar una venta
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { producto_id, cantidad, fecha_venta, total } = req.body;
  try {
    const result = await pool.query(
      "UPDATE ventas SET producto_id = $1, cantidad = $2, fecha_venta = $3, total = $4 WHERE id = $5 RETURNING *",
      [producto_id, cantidad, fecha_venta, total, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Eliminar una venta
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM ventas WHERE id = $1", [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
