import express from "express";
import cors from "cors";
import usuarioRoutes from "./src/routes/usuario.routes.js";

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/usuarios", usuarioRoutes);

app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}\nhttp://localhost:${port}`);
});
