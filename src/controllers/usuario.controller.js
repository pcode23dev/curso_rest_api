import {
  criarUsuarioService,
  buscarUsuariosService,
  buscarUsuarioService,
  actualizarUsuarioService,
  deletarUsuarioService,
} from "../services/usuario.service.js";

export async function buscarUsuariosController(req, res, next) {
  try {
    const usuarios = await buscarUsuariosService();
    console.log(usuarios);

    res.status(200).json({
      msg: "Usuários encontrados",
      dados: usuarios,
    });
  } catch (error) {
    next(error);
  }
}

export async function buscarUsuarioController(req, res, next) {
  try {
    const id = Number(req.params.id);
    const usuario = await buscarUsuarioService(id);

    res.status(200).json({
      msg: "Usuário encontrado",
      dados: usuario,
    });
  } catch (error) {
    next(error);
  }
}

export async function criarUsuarioController(req, res) {
  try {
    const { nome, idade } = req.body;

    const usuariocriado = await criarUsuarioService(nome, idade);

    res.status(201).json({
      msg: "Usuário criado com sucesso",
      dados: usuariocriado,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      code: error.statusCode || 500,
      msg: error.message,
    });
  }
}

export async function actualizarUsuarioController(req, res) {
  try {
    const id = Number(req.params.id);
    const dados = req.body;
    const usuarioActualizado = await actualizarUsuarioService(id, dados);

    res.status(200).json({
      msg: "Usuário actualizado com sucesso",
      dados: usuarioActualizado,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      code: error.statusCode || 500,
      msg: error.message,
    });
  }
}

export async function deletarUsuarioController(req, res) {
  try {
    const id = Number(req.params.id);
    const usuarioDeletado = await deletarUsuarioService(id);

    res.status(200).json({
      msg: "Usuário deletado com sucesso",
      dados: usuarioDeletado,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      code: error.statusCode || 500,
      msg: error.message,
    });
  }
}
