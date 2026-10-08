import pool from "../config/db.js";

export async function criarUsuario(nome, idade) {
  const resultado = await pool.query(
    "INSERT INTO usuarios (nome, idade) VALUES ($1,$2) RETURNING *",
    [nome, idade],
  );

  return resultado.rows[0];

}

export async function buscarUsuarios() {
  
    const resultado = await pool.query("SELECT id, nome, idade FROM usuarios;");
    return resultado.rows;
 
}

export async function buscarUsuario(id) {
 
    const resultado = await pool.query(
      "SELECT id, nome, idade FROM usuarios WHERE id = $1;",
      [id],
    );

    return resultado.rows[0];
  
}

export async function actualizarUsuario(id, dados) {

  const { nome, idade } = dados;

  if (nome !== undefined && idade !== undefined) {

    const resultado = await pool.query(
      `UPDATE usuarios
       SET nome = $1, idade = $2
       WHERE id = $3
       RETURNING *`,
      [nome, idade, id]
    );

    return resultado.rows[0];
  }

  if (nome !== undefined && idade === undefined) {

    const resultado = await pool.query(
      `UPDATE usuarios
       SET nome = $1
       WHERE id = $2
       RETURNING *`,
      [nome, id]
    );

    return resultado.rows[0];
  }

  if (nome === undefined && idade !== undefined) {

    const resultado = await pool.query(
      `UPDATE usuarios
       SET idade = $1
       WHERE id = $2
       RETURNING *`,
      [idade, id]
    );

    return resultado.rows[0];
  }
}
export async function deletarUsuario(id) {
 
    const resultado = await pool.query(
      "DELETE FROM usuarios WHERE id = $1 RETURNING *;",
      [id],
    );

    return resultado.rows[0];
 
}
