import { Router } from "express";
import {
    actualizarUsuarioController,
  buscarUsuarioController,
  buscarUsuariosController,
  criarUsuarioController,
  deletarUsuarioController,
} from "../controllers/usuario.controller.js";
import usuariosMiddlewares from "../schemas/usuario.schema.js";
import validateMiddleware from "../middlewares/validate.middleware.js";

const router = Router();

router.get("/", buscarUsuariosController);

router.get("/:id", buscarUsuarioController);

router.post(
  "/", 
  validateMiddleware(usuariosMiddlewares.usuarioCriarSchema),
  criarUsuarioController
);

router.put("/:id", 
  validateMiddleware(usuariosMiddlewares.usuarioAtualizarSchema),
  actualizarUsuarioController);

router.delete("/:id", deletarUsuarioController);

export default router;
