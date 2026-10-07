# CursoAPI — Guia de Aprendizagem: Node.js + PostgreSQL

## 1. Objetivo do estudo

Este documento reúne o que já foi estudado no projeto `cursoAPI` durante a transição de desenvolvimento JavaScript para Backend com Node.js, Express e PostgreSQL.

O objetivo principal é sair de APIs simuladas usando arrays em memória e chegar a uma API REST real, organizada em camadas, com persistência no PostgreSQL, validação, tratamento de erros, autenticação e boas práticas.

---

# 2. Conhecimentos de JavaScript já consolidados

Antes de entrar no PostgreSQL, os seguintes fundamentos já estavam dominados:

- Variáveis
- Funções
- Arrow Functions
- Arrays
- Objetos
- Destructuring
- Spread Operator
- `map()`
- `filter()`
- `find()`
- Promises
- `async/await`
- `try/catch`
- `Promise.all()`
- `Promise.allSettled()`

Também já foram feitos vários exercícios simulando APIs com arrays em memória.

## Exemplo de objeto padronizado

Os exercícios anteriores utilizavam respostas semelhantes a:

```js
{
  dados,
  msg,
  code
}
```

Também foram praticadas validações como:

```js
if (!nome)
if (typeof nome !== "string")
if (nome.trim() === "")
if (typeof idade !== "number")
if (idade <= 0)
if (idade > 125)
```

Isso foi importante porque a lógica de validação posteriormente foi transferida para a camada `service`.

---

# 3. Dependências do projeto

O projeto `cursoAPI` possui:

## Dependências

- `express`
- `pg`
- `dotenv`
- `cors`
- `helmet`
- `bcrypt`
- `jsonwebtoken`
- `zod`

## Dev dependencies

- `nodemon`
- `tsx`
- `typescript`
- `@types/node`
- `@types/express`
- `@types/pg`

Nem todas essas bibliotecas já foram utilizadas. As que ainda estão pendentes serão incorporadas progressivamente.

---

# 4. Configuração do projeto

O `package.json` possui:

```json
{
  "type": "module"
}
```

Isso significa que o projeto utiliza ES Modules.

Assim, os imports locais precisam informar a extensão `.js`.

## Exemplo

### Errado

```js
import usuarioController from "../controllers/usuario.controller";
```

### Correto

```js
import usuarioController from "../controllers/usuario.controller.js";
```

Esse detalhe causou o erro `ERR_MODULE_NOT_FOUND` e foi identificado e corrigido.

---

# 5. Estrutura atual do projeto

```text
cursoAPI/
├── .env
├── package.json
├── apps.js
│
└── src/
    ├── config/
    │   └── db.js
    ├── controllers/
    │   └── usuario.controller.js
    ├── repositories/
    │   └── usuario.repository.js
    ├── services/
    │   └── usuario.service.js
    └── routes/
        └── usuario.routes.js
```

O arquivo principal da aplicação foi mantido na raiz para facilitar o carregamento da configuração do ambiente no estado atual do projeto.

---

# 6. Variáveis de ambiente e dotenv

O projeto possui um arquivo `.env` na raiz:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=root
DB_NAME=db_user
```

## Problema encontrado

Inicialmente foi utilizado:

```js
dotenv.config();
```

mas as variáveis apareciam como `undefined`.

Foi descoberto que o arquivo `.env` não estava sendo encontrado automaticamente devido à estrutura/localização dos arquivos.

A solução adotada em `db.js` foi:

```js
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../../.env")
});
```

## Conceito aprendido

`dotenv` carrega variáveis do `.env` para:

```js
process.env
```

Exemplo:

```js
process.env.DB_HOST
process.env.DB_PORT
process.env.DB_USER
process.env.DB_PASSWORD
process.env.DB_NAME
```

Um cuidado importante é que a localização do `.env` e a forma como ele é carregado precisam estar alinhadas com a estrutura do projeto.

---

# 7. Conexão Node.js → PostgreSQL

O arquivo `src/config/db.js` utiliza `pg`:

```js
import pg from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../../.env")
});

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

export default pool;
```

## O que é `Pool`?

`Pool` é um conjunto de conexões reutilizáveis com o banco.

Em vez de abrir e fechar uma conexão manualmente para cada consulta, a aplicação pode utilizar o pool.

A consulta básica é:

```js
const resultado = await pool.query("SELECT NOW()");
```

Esse teste foi executado com sucesso.

---

# 8. Problema de conexão com o banco errado

Em determinado momento a aplicação apresentava:

```text
column "idade" of relation "usuarios" does not exist
```

Porém, no pgAdmin a tabela correta tinha:

```text
id
nome
idade
```

O problema era que o Node.js estava conectado ao banco errado.

Depois de corrigir o `DB_NAME`, o problema foi resolvido.

## Aprendizado

Quando o código e o pgAdmin parecem mostrar estruturas diferentes, uma verificação útil é:

```sql
SELECT current_database();
```

ou, pelo Node:

```js
const resultado = await pool.query(
  "SELECT current_database();"
);

console.log(resultado.rows);
```

---

# 9. Criação da tabela `usuarios`

Foi criada a tabela:

```sql
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  idade INTEGER NOT NULL
);
```

## Conceitos

### `SERIAL`

Gera valores incrementais para o ID.

Exemplo:

```text
1
2
3
4
5
```

### `PRIMARY KEY`

Define o identificador único do registro.

### `VARCHAR(100)`

Armazena texto com até 100 caracteres.

### `NOT NULL`

Indica que o campo é obrigatório.

### `INTEGER`

Armazena números inteiros.

---

# 10. Primeiro INSERT com Node.js

Foi implementado:

```js
async function criarUsuario(nome, idade) {
  const resultado = await pool.query(
    "INSERT INTO usuarios (nome, idade) VALUES ($1, $2) RETURNING *",
    [nome, idade]
  );

  return resultado.rows[0];
}
```

## Parâmetros `$1` e `$2`

Em vez de montar SQL diretamente:

```js
`INSERT INTO usuarios (...) VALUES ('${nome}', ${idade})`
```

utiliza-se:

```sql
VALUES ($1, $2)
```

e os valores são passados separadamente:

```js
[nome, idade]
```

Isso é importante para segurança e evita a concatenação direta de valores na query.

---

# 11. `RETURNING *`

No PostgreSQL:

```sql
RETURNING *
```

faz com que o registro recém-inserido seja devolvido pela operação.

Por isso:

```js
resultado.rows[0]
```

pode produzir:

```js
{
  id: 5,
  nome: "Igor",
  idade: 20
}
```

## Conceito importante

O `RETURNING` estava funcionando. O problema inicial era que o retorno da Promise não estava sendo exibido.

Exemplo:

```js
const usuarioCriado = await criarUsuario("Igor", 20);

console.log(usuarioCriado);
```

---

# 12. Ordem de execução assíncrona

Foi identificado um problema importante:

```js
criarUsuario("Bento", 50);
buscarUsuarios();
```

As duas funções eram assíncronas e foram iniciadas sem controlar a ordem.

Para garantir:

1. criar
2. esperar criar
3. buscar

usa-se:

```js
const usuarioCriado = await criarUsuario("Igor", 20);

console.log(usuarioCriado);

const usuarios = await buscarUsuarios();

console.log(usuarios);
```

ou dentro de uma função:

```js
async function main() {
  const usuarioCriado = await criarUsuario("Igor", 20);
  console.log(usuarioCriado);

  const usuarios = await buscarUsuarios();
  console.log(usuarios);
}

await main();
```

## Conceito

`await` pausa a execução daquela função assíncrona até que a Promise seja resolvida ou rejeitada.

---

# 13. CRUD em PostgreSQL

Foram implementadas as quatro operações principais:

```text
CREATE
READ
UPDATE
DELETE
```

## CREATE

```sql
INSERT INTO usuarios (nome, idade)
VALUES ($1, $2)
RETURNING *
```

## READ - todos

```sql
SELECT id, nome, idade
FROM usuarios
```

## READ - por ID

```sql
SELECT id, nome, idade
FROM usuarios
WHERE id = $1
```

## UPDATE

```sql
UPDATE usuarios
SET nome = $1,
    idade = $2
WHERE id = $3
RETURNING *
```

## DELETE

```sql
DELETE FROM usuarios
WHERE id = $1
RETURNING *
```

---

# 14. `resultado.rows`

O pacote `pg` retorna um objeto de resultado.

Exemplo:

```js
{
  rows: [
    {
      id: 5,
      nome: "Igor",
      idade: 20
    }
  ]
}
```

Para pegar um único usuário:

```js
resultado.rows[0]
```

Para pegar todos:

```js
resultado.rows
```

---

# 15. Repository

Foi criado:

```text
src/repositories/usuario.repository.js
```

O Repository é responsável pelo acesso ao banco.

Versão conceitual:

```js
import pool from "../config/db.js";

export async function criarUsuario(nome, idade) {
  const resultado = await pool.query(
    "INSERT INTO usuarios (nome, idade) VALUES ($1,$2) RETURNING *",
    [nome, idade]
  );

  return resultado.rows[0];
}

export async function buscarUsuarios() {
  const resultado = await pool.query(
    "SELECT id, nome, idade FROM usuarios"
  );

  return resultado.rows;
}

export async function buscarUsuario(id) {
  const resultado = await pool.query(
    "SELECT id, nome, idade FROM usuarios WHERE id = $1",
    [id]
  );

  return resultado.rows[0];
}

export async function actualizarUsuario(id, dados) {
  const { nome, idade } = dados;

  const resultado = await pool.query(
    "UPDATE usuarios SET nome = $1, idade = $2 WHERE id = $3 RETURNING *",
    [nome, idade, id]
  );

  return resultado.rows[0];
}

export async function deletarUsuario(id) {
  const resultado = await pool.query(
    "DELETE FROM usuarios WHERE id = $1 RETURNING *",
    [id]
  );

  return resultado.rows[0];
}
```

---

# 16. Por que o Repository não precisa capturar todos os erros?

Antes, as funções tinham:

```js
try {
  ...
} catch (error) {
  console.error(error.message);
}
```

Foi entendido que isso pode esconder erros da camada superior.

Se o Repository captura e apenas imprime:

```js
console.error(error.message);
```

quem chamou pode receber `undefined` em vez de saber que houve uma falha.

Por isso foi adotada a ideia de deixar erros subirem para as camadas superiores.

## Responsabilidade

```text
Repository
↓
Acesso a dados
```

O Repository não deve decidir qual resposta HTTP o cliente receberá.

---

# 17. Service

Foi criada a camada:

```text
src/services/usuario.service.js
```

Responsabilidade:

```text
Regras de negócio
Validações
Coordenação das operações
```

Exemplo de import:

```js
import {
  criarUsuario,
  buscarUsuario,
  buscarUsuarios,
  actualizarUsuario,
  deletarUsuario
} from "../repositories/usuario.repository.js";
```

---

# 18. Validação de nome

A validação estudada:

```js
const validarNome = (nome) => {
  if (typeof nome !== "string") {
    throw new Error("Nome deve ser uma string.");
  }

  if (nome.trim() === "") {
    throw new Error("Nome é obrigatório.");
  }
};
```

## Conceitos

`typeof` verifica o tipo.

```js
typeof "Paulo"
// "string"

typeof 20
// "number"

typeof undefined
// "undefined"
```

`trim()` remove espaços no começo e no fim.

Assim:

```js
"   ".trim()
```

resulta em:

```text
""
```

---

# 19. Validação de idade

Foi utilizada:

```js
const validarIdade = (idade) => {
  if (typeof idade !== "number") {
    throw new Error("Idade deve ser um número.");
  }

  if (idade <= 0) {
    throw new Error("Idade deve ser maior que zero.");
  }

  if (idade > 125) {
    throw new Error("Idade inválida.");
  }
};
```

Condições praticadas:

```text
deve ser número
> 0
<= 125
```

---

# 20. Validação de ID

Foi criada:

```js
const validarId = (id) => {
  if (typeof id !== "number" || id <= 0) {
    throw new Error(
      "ID inválido. Deve ser um número positivo."
    );
  }
};
```

O objetivo é impedir IDs inválidos antes de acessar o Repository.

---

# 21. `throw new Error()`

Validações no Service podem fazer:

```js
throw new Error("Nome é obrigatório.");
```

Quando isso acontece, a execução daquele fluxo é interrompida e o erro pode ser tratado pelo chamador.

---

# 22. Erro de função aninhada na validação

Foi cometido e identificado um pequeno bug:

```js
const validarNome = (nome) => {
  const validarNome = (nome) => {
    ...
  };
};
```

A função interna era criada, mas nunca executada.

O correto:

```js
const validarNome = (nome) => {
  if (typeof nome !== "string") {
    throw new Error("Nome deve ser uma string.");
  }

  if (nome.trim() === "") {
    throw new Error("Nome é obrigatório.");
  }
};
```

## Aprendizado

Criar uma função dentro de outra função não significa executá-la.

---

# 23. Testes manuais das validações

Foram feitos testes como:

```js
try {
  const usuario = await criarUsuarioService("", 23);
  console.log(usuario);
} catch (error) {
  console.log(error.message);
}

try {
  const usuario = await criarUsuarioService("pp", -23);
  console.log(usuario);
} catch (error) {
  console.log(error.message);
}

try {
  const usuario = await criarUsuarioService("ou");
  console.log(usuario);
} catch (error) {
  console.log(error.message);
}
```

Resultado:

```text
Nome é obrigatório.
Idade deve ser maior que zero.
Idade deve ser um número.
```

Isso confirmou que o Service estava bloqueando dados inválidos antes do INSERT.

---

# 24. Service de criação

A lógica foi:

```js
export async function criarUsuarioService(nome, idade) {
  validarNome(nome);
  validarIdade(idade);

  return await criarUsuario(nome, idade);
}
```

Fluxo:

```text
criarUsuarioService()
    ↓
validarNome()
    ↓
validarIdade()
    ↓
Repository
    ↓
PostgreSQL
```

Se uma validação falhar:

```text
throw
```

e o Repository não é chamado.

---

# 25. `async` só quando necessário

Foi percebido que uma função que não utiliza `await` não precisa ser `async`.

Por exemplo:

```js
export function validarUsuario(dados) {
  const { nome, idade } = dados;

  validarNome(nome);
  validarIdade(idade);
}
```

Não é necessário:

```js
export async function validarUsuario(...)
```

se não existe operação assíncrona.

---

# 26. Express

Foi introduzido o Express para transformar as funções em uma API HTTP real.

Aplicação:

```js
import express from "express";
import cors from "cors";
import usuarioRoutes from "./routes/usuario.routes.js";

const port = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/usuarios", usuarioRoutes);

app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});
```

## `express.json()`

Permite interpretar JSON recebido no body.

Exemplo:

```json
{
  "nome": "Paulo",
  "idade": 22
}
```

será acessível por:

```js
req.body
```

## `cors()`

Habilita a configuração de Cross-Origin Resource Sharing.

---

# 27. Routes

Foi criado:

```text
src/routes/usuario.routes.js
```

Configuração atual:

```js
import { Router } from "express";

import {
  actualizarUsuarioController,
  buscarUsuarioController,
  buscarUsuariosController,
  criarUsuarioController,
  deletarUsuarioController
} from "../controllers/usuario.controller.js";

const router = Router();

router.get("/", buscarUsuariosController);
router.get("/:id", buscarUsuarioController);
router.post("/", criarUsuarioController);
router.put("/:id", actualizarUsuarioController);
router.delete("/:id", deletarUsuarioController);

export default router;
```

Como no app existe:

```js
app.use("/usuarios", usuarioRoutes);
```

os endpoints ficam:

```text
GET    /usuarios
GET    /usuarios/:id
POST   /usuarios
PUT    /usuarios/:id
DELETE /usuarios/:id
```

Todos foram testados no Postman e estão funcionando.

---

# 28. Controller

O Controller é responsável pela comunicação HTTP.

Ele trabalha principalmente com:

```js
req
res
req.params
req.body
res.status()
res.json()
```

---

# 29. Buscar todos

```js
export async function buscarUsuariosController(req, res) {
  try {
    const usuarios = await buscarUsuariosService();

    res.status(200).json({
      msg: "Usuários encontrados",
      dados: usuarios
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message
    });
  }
}
```

---

# 30. Buscar por ID

A ideia é:

```js
export async function buscarUsuarioController(req, res) {
  try {
    const id = Number(req.params.id);

    const usuario = await buscarUsuarioService(id);

    res.status(200).json({
      msg: "Usuário encontrado",
      dados: usuario
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message
    });
  }
}
```

## Conceito importante

`req.params.id` chega como string.

Exemplo:

```http
GET /usuarios/5
```

produz:

```js
req.params.id
// "5"
```

Por isso, para a validação que exige número:

```js
const id = Number(req.params.id);
```

vira:

```js
5
```

---

# 31. Criar usuário

Controller:

```js
export async function criarUsuarioController(req, res) {
  try {
    const { nome, idade } = req.body;

    const usuarioCriado = await criarUsuarioService(
      nome,
      idade
    );

    res.status(201).json({
      msg: "Usuário criado com sucesso",
      dados: usuarioCriado
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message
    });
  }
}
```

Endpoint:

```http
POST /usuarios
```

Body:

```json
{
  "nome": "Paulo",
  "idade": 22
}
```

---

# 32. Atualizar usuário

Endpoint:

```http
PUT /usuarios/:id
```

Body:

```json
{
  "nome": "Paulo Atualizado",
  "idade": 23
}
```

O Controller recebe `req.params.id`, converte para número e encaminha o body ao Service.

---

# 33. Deletar usuário

Endpoint:

```http
DELETE /usuarios/:id
```

O Controller recebe e converte o ID, chama o Service e devolve JSON.

---

# 34. Fluxo completo da arquitetura

Atualmente, o projeto já tem este fluxo:

```text
POST /usuarios
        ↓
Route
        ↓
criarUsuarioController
        ↓
criarUsuarioService
        ↓
validarNome / validarIdade
        ↓
criarUsuario
        ↓
pool.query()
        ↓
PostgreSQL
```

Para leitura:

```text
GET /usuarios
        ↓
buscarUsuariosController
        ↓
buscarUsuariosService
        ↓
buscarUsuarios
        ↓
SELECT
        ↓
PostgreSQL
```

Este padrão é chamado de separação de responsabilidades.

---

# 35. Status HTTP

Já foi reconhecido que a aplicação não deve responder `500` para qualquer problema.

A ideia correta é:

```text
200 OK
→ consulta, atualização ou operação bem-sucedida

201 Created
→ recurso criado

400 Bad Request
→ dados enviados pelo cliente são inválidos

404 Not Found
→ recurso solicitado não existe

500 Internal Server Error
→ erro inesperado interno, como falha de infraestrutura
```

Exemplo:

```text
nome inválido → 400
idade negativa → 400
idade não numérica → 400
id inválido → 400
id válido mas usuário não encontrado → 404
falha PostgreSQL → 500
```

---

# 36. Próxima evolução: AppError

Planejado:

```text
src/utils/AppError.js
```

Com:

```js
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}
```

Isso permitirá:

```js
throw new AppError(
  "Nome é obrigatório.",
  400
);
```

ou:

```js
throw new AppError(
  "Usuário não encontrado.",
  404
);
```

---

# 37. Próxima evolução: middleware global de erros

Os Controllers atualmente possuem vários:

```js
try {
  ...
} catch (error) {
  ...
}
```

Foi identificado que isso cria repetição.

A próxima evolução arquitetural será centralizar o tratamento de erros em um middleware global do Express:

```text
Controller
   ↓
throw
   ↓
Error Middleware
   ↓
res.status(...)
```

Isso reduzirá a repetição e deixará os Controllers menores.

---

# 38. Zod

O projeto já possui `zod` instalado.

Ele ainda não foi integrado.

A ideia será substituir gradualmente várias validações manuais por schemas.

Exemplo futuro:

```js
import { z } from "zod";

const usuarioSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(1, "Nome é obrigatório.")
    .max(100),

  idade: z
    .number()
    .int()
    .positive()
    .max(125)
});
```

Importante: Zod ainda é uma etapa futura; as validações manuais continuam úteis para entender a lógica.

---

# 39. Bibliotecas futuras

## `helmet`

Segurança de headers HTTP.

## `bcrypt`

Hash de senhas.

Ideia futura:

```js
const hash = await bcrypt.hash(senha, 10);
```

## `jsonwebtoken`

Autenticação baseada em JWT.

Exemplo futuro:

```js
const token = jwt.sign(
  { userId: usuario.id },
  process.env.JWT_SECRET
);
```

## `zod`

Validação e parsing dos dados recebidos pela API.

---

# 40. O que já está concluído

## JavaScript

- fundamentos de linguagem
- funções
- objetos
- arrays
- métodos de arrays
- destructuring
- Promises
- async/await
- tratamento de erros
- execução assíncrona

## PostgreSQL

- conexão
- `Pool`
- criação da tabela
- INSERT
- SELECT
- SELECT por ID
- UPDATE
- DELETE
- parâmetros `$1`, `$2`, `$3`
- `RETURNING *`

## Node.js

- ES Modules
- imports/exports
- `.env`
- `process.env`
- `pg`

## Arquitetura

- Repository
- Service
- Controller
- Routes

## HTTP / Express

- Express
- `express.json()`
- CORS
- rotas
- `req.params`
- `req.body`
- `res.status()`
- `res.json()`

## Ferramenta de testes

- Postman

---

# 41. O que ainda falta

Sequência planejada:

```text
[CONCLUÍDO]
PostgreSQL
CRUD
Repository
Service
Controllers
Routes
Express
Postman

↓ PRÓXIMO

AppError
Error Middleware global
Status HTTP corretos
Zod

↓ DEPOIS

Helmet / segurança
Modelagem de usuários com email/senha
bcrypt
JWT
Login
Autenticação
Autorização

↓ MAIS À FRENTE

Variáveis/configuração mais robustas
Middleware de autenticação
Relacionamentos entre tabelas
Migrações
Paginação
Filtros
Logs
Testes automatizados
Documentação da API
Deploy
Docker
```

---

# 42. Modelo mental principal

O conceito mais importante aprendido até agora:

```text
ROUTE
"Qual rota foi chamada?"

        ↓

CONTROLLER
"Estou falando HTTP.
Vou pegar req e produzir res."

        ↓

SERVICE
"Quais regras e validações precisam acontecer?"

        ↓

REPOSITORY
"Como converso com PostgreSQL?"

        ↓

DATABASE
"Persisto os dados."
```

Cada camada deve ter uma responsabilidade clara.

---

# 43. Comparação com os antigos exercícios de arrays

Antes:

```js
const usuarios = [];

usuarios.push({
  id: 1,
  nome: "Paulo",
  idade: 22
});
```

Agora:

```sql
INSERT INTO usuarios (...)
```

Antes:

```js
usuarios.find(usuario => usuario.id === id)
```

Agora:

```sql
SELECT *
FROM usuarios
WHERE id = $1
```

Antes:

```js
usuarios.map(...)
```

Agora:

```sql
SELECT ...
FROM usuarios
```

Antes:

```js
usuarios.splice(...)
```

Agora:

```sql
DELETE FROM usuarios
WHERE id = $1
```

A ideia continua sendo a mesma: o que mudou foi o mecanismo de persistência.

---

# 44. Boas práticas que já começaram a ser aplicadas

- Separação de responsabilidades
- Queries parametrizadas
- `RETURNING *` quando é útil
- Seleção explícita de colunas em consultas
- Reutilização do `Pool`
- `async/await`
- `export/import`
- Estrutura por camadas
- Testes pelo Postman
- Validação antes de acessar o banco
- Diferenciação planejada dos códigos HTTP

---

# 45. Estado atual do projeto

A API CRUD já está funcionando através do Postman.

Rotas:

```http
GET    /usuarios
GET    /usuarios/:id
POST   /usuarios
PUT    /usuarios/:id
DELETE /usuarios/:id
```

O PostgreSQL é o armazenamento real.

A aplicação já possui:

```text
Route
Controller
Service
Repository
Database
```

O próximo grande objetivo é tornar a API mais profissional no tratamento de erros e depois introduzir Zod.

---

# 46. Exercício mental importante

Para qualquer nova funcionalidade, perguntar:

### É HTTP?

Vai para Controller/Route.

### É regra de negócio?

Vai para Service.

### É SQL ou banco?

Vai para Repository.

### É configuração?

Vai para Config.

### É validação estruturada de entrada?

Pode ser feita com Zod e integrada à camada adequada.

Esse raciocínio é mais importante do que decorar nomes de pastas.

---

# 47. Comandos úteis já usados

Rodar a aplicação:

```powershell
node .\apps.js
```

Com Nodemon:

```powershell
nodemon .\apps.js
```

Executar um arquivo específico:

```powershell
node .\src\services\usuario.service.js
```

---

# 48. Conclusão

O projeto saiu de simulações em memória e chegou a uma API CRUD com persistência real.

O caminho foi:

```text
JavaScript
   ↓
Promises / async-await
   ↓
APIs simuladas com arrays
   ↓
PostgreSQL
   ↓
pg / Pool
   ↓
CRUD SQL
   ↓
Repository
   ↓
Service
   ↓
Controller
   ↓
Routes
   ↓
Express
   ↓
Postman
```

O próximo salto não é simplesmente adicionar mais endpoints. É melhorar a qualidade arquitetural da API:

```text
AppError
↓
middleware global de erros
↓
status HTTP corretos
↓
Zod
```

Depois disso:

```text
bcrypt
↓
JWT
↓
login
↓
autenticação
↓
autorização
```

Este é o estado atual do curso.
