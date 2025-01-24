const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

// Importar rutas
const categoriasRoutes = require("./routes/categorias");
const productosRoutes = require("./routes/productos");
const clientesRoutes = require("./routes/clientes");
const ventasRoutes = require("./routes/ventas");

// Registrar rutas
app.use("/api/categorias", categoriasRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/ventas", ventasRoutes);

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
