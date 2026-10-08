import usuarioSchema from "../schemas/usuario.schema.js";
import usuariosSchema from "../schemas/usuario.schema.js";
import {
  criarUsuarioService,
  buscarUsuariosService,
  buscarUsuarioService,
  actualizarUsuarioService,
  deletarUsuarioService,
} from "../services/usuario.service.js";

export async function buscarUsuariosController(req, res) {
  const usuarios = await buscarUsuariosService();
  console.log(usuarios);

  res.status(200).json({
    msg: "Usuários encontrados",
    dados: usuarios,
  });
}

export async function buscarUsuarioController(req, res) {
  const id = Number(req.params.id);
  const usuario = await buscarUsuarioService(id);

  res.status(200).json({
    msg: "Usuário encontrado",
    dados: usuario,
  });
}

export async function criarUsuarioController(req, res) {
  const { nome, idade } = req.body;

  const usuariocriado = await criarUsuarioService(nome, idade);

  res.status(201).json({
    msg: "Usuário criado com sucesso",
    dados: usuariocriado,
  });
}

export async function actualizarUsuarioController(req, res) {
  const id = Number(req.params.id);

  const dados = req.body;
  const usuarioActualizado = await actualizarUsuarioService(id, dados);

  res.status(200).json({
    msg: "Usuário actualizado com sucesso",
    dados: usuarioActualizado,
  });
}

export async function deletarUsuarioController(req, res) {
  const id = Number(req.params.id);
  const usuarioDeletado = await deletarUsuarioService(id);

  res.status(200).json({
    msg: "Usuário deletado com sucesso",
    dados: usuarioDeletado,
  });
}
