import pool from './src/config/db.js';

async function testarConexao(){
    try {
        const resultado = await pool.query('SELECT NOW()');
        console.log('Conexão com o banco de dados estabelecida com sucesso!');
        console.log('Resultado:', resultado.rows[0]);
    } catch (error) {
        console.error('Erro ao testar conexão com o banco de dados:', error);
    } finally {
        await pool.end();
    }
}

console.log("ENV:", process.env.DB_NAME);

console.log({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


testarConexao(); 


const banco = await pool.query(
  'SELECT current_database();'
);

console.log(banco.rows);