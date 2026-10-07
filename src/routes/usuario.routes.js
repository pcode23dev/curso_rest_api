import { Router } from "express";
import {
    actualizarUsuarioController,
  buscarUsuarioController,
  buscarUsuariosController,
  criarUsuarioController,
  deletarUsuarioController,
} from "../controllers/usuario.controller.js";

const router = Router();

router.get("/", buscarUsuariosController);

router.get("/:id", buscarUsuarioController);

router.post("/", criarUsuarioController);

router.put("/:id", actualizarUsuarioController);

router.delete("/:id", deletarUsuarioController);

export default router;
