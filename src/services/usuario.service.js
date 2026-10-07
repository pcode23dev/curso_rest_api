import {
  actualizarUsuario,
  buscarUsuario,
  buscarUsuarios,
  criarUsuario,
  deletarUsuario,
} from "../repositories/usuario.repository.js";
import { AppError } from "../utils/AppError.js";

const validarNome = (nome) => {
  if (typeof nome !== "string") {
    throw new AppError("Nome deve ser uma string.", 400);
  }

  if (nome.trim() === "") {
    throw new AppError("Nome é obrigatório.", 400);
  }
};

const validarIdade = (idade) => {
  if (typeof idade !== "number") {
    throw new AppError("Idade deve ser um número.", 400);
  }

  if (idade <= 0) {
    throw new AppError("Idade deve ser maior que zero.", 400);
  }

  if (idade > 125) {
    throw new AppError("Idade inválida.", 400);
  }
};

const validarId = (id) => {
  if (typeof id !== "number" || id <= 0) {
    throw new AppError("ID inválido. Deve ser um número positivo.", 400);
  }
};

export function validarUsuario(dados) {
  const { nome, idade } = dados;
  validarNome(nome);
  validarIdade(idade);
}

export async function criarUsuarioService(nome, idade) {
  validarNome(nome);
  validarIdade(idade);
  return await criarUsuario(nome, idade);
}

export async function buscarUsuariosService() {
  return await buscarUsuarios();
}

export async function buscarUsuarioService(id) {
  validarId(id);
  const usuario = await buscarUsuario(id);
  if (!usuario) {
    throw new AppError(`Usuário com ID ${id} não encontrado.`, 404);
  }
  return usuario;
}

export async function actualizarUsuarioService(id, dados) {
  validarId(id);
  validarUsuario(dados);
  const usuarioActualizado = await actualizarUsuario(id, dados);
  if (!usuarioActualizado) {
    throw new AppError(`Usuário com ID ${id} não encontrado.`, 404);
  }
  return usuarioActualizado;
}

export async function deletarUsuarioService(id) {
  validarId(id);
  const usuarioDeletado = await deletarUsuario(id);
  if (!usuarioDeletado) {
    throw new AppError(`Usuário com ID ${id} não encontrado.`, 404);
  }
  return usuarioDeletado;
}

export default {
  criarUsuarioService,
  buscarUsuariosService,
  buscarUsuarioService,
  actualizarUsuarioService,
  deletarUsuarioService
}