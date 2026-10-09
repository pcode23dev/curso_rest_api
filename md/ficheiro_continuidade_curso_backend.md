# Ficheiro de Continuidade --- Curso de Backend

**Finalidade:** retomar o curso noutra conversa preservando o progresso,
as decisões técnicas, a sequência pedagógica e o próximo passo.

## 1. Objetivo do curso

O estudante está a construir competências de desenvolvimento backend com
JavaScript/Node.js, Express e PostgreSQL. O objetivo é compreender os
conceitos e as responsabilidades de cada camada, implementar
funcionalidades com autonomia e, no final, integrar as tecnologias num
projeto robusto com testes automatizados.

O projeto final fica reservado para o fim do percurso. As etapas
intermédias devem usar exercícios pequenos e práticos, sem tentar
construir antecipadamente a aplicação completa.

## 2. Método de ensino acordado

-   Ensinar em português, com explicações claras e progressivas.
-   Explicar primeiro o conceito e a razão de o utilizar; depois
    implementar.
-   Não omitir passos importantes quando surgir um conceito novo.
-   Não repetir extensivamente fundamentos que o estudante já demonstrou
    dominar.
-   Rever o código atual antes de propor alterações grandes.
-   Explicar o fluxo dos dados e a responsabilidade de cada camada.
-   Propor exercícios práticos, permitindo que o estudante implemente
    partes por conta própria.
-   Conduzir a sequência de aprendizagem: o assistente recomenda a
    próxima etapa com base nas dependências pedagógicas.
-   Registar o progresso nos ficheiros de Continuidade e de Aprendizagem
    quando o escopo ou uma etapa mudar.

## 3. Roteiro de aprendizagem acordado

A sequência planeada é:

1.  **Base de backend --- consolidada:** Node.js, Express, PostgreSQL,
    CRUD, arquitetura em camadas, Zod e tratamento de erros.
2.  **Autenticação e segurança:** bcrypt, cadastro seguro, login, JWT,
    middleware de autenticação, rotas protegidas e autorização/perfis.
3.  **TypeScript aplicado ao backend:** tipos, interfaces, funções
    tipadas, modelos de dados e integração com Express.
4.  **NestJS:** módulos, controllers, providers, services, injeção de
    dependências, DTOs e pipes.
5.  **ORM:** estudar Prisma ou TypeORM; a escolha final deve ser feita
    quando esta etapa se aproximar. Incluir modelos, relações,
    migrations e consultas.
6.  **Testes automatizados:** testes unitários e de integração, mocks e
    testes de endpoints; considerar Jest ou Vitest e Supertest.
7.  **Projeto final robusto:** integrar as tecnologias e competências
    estudadas, implementar testes, documentação e preparação para
    deployment.

Esta é a sequência pedagógica acordada. Pode ser ajustada se os
exercícios revelarem uma dependência importante, mas não se deve saltar
de forma arbitrária para o projeto final. O estudante indicou que ainda
prevê aproximadamente quatro ou cinco etapas/frameworks antes do projeto
final.

## 4. Próxima etapa exata

**Próxima etapa: autenticação e segurança, começando pelo bcrypt.**

Sequência interna: 1. Compreender hashing de senhas e por que não se
guardam senhas em texto simples. 2. Adicionar a estrutura necessária à
tabela de utilizadores sem expor credenciais. 3. Implementar o hash no
cadastro. 4. Implementar login e comparação com `bcrypt.compare()`. 5.
Introduzir JWT e explicar o que o token representa. 6. Validar tokens
através de middleware. 7. Proteger rotas. 8. Distinguir autenticação de
autorização e implementar permissões quando adequado.

Não começar diretamente pelo JWT antes de compreender o armazenamento e
a verificação segura de senhas.

## 5. Projeto principal: `cursoAPI`

### Tecnologias conhecidas

-   Node.js e Express
-   PostgreSQL com `pg`
-   `dotenv`
-   Zod
-   `AppError` personalizado
-   Middleware global de erros
-   Middleware de validação
-   ES Modules (`"type": "module"`); imports locais usam `.js`.

Dependências mencionadas incluem `express`, `pg`, `dotenv`, `cors`,
`helmet`, `bcrypt`, `jsonwebtoken`, `zod`, `nodemon`, `tsx`,
`typescript` e tipos associados. Uma dependência instalada não significa
que já tenha sido estudada ou integrada.

### Estrutura conhecida

``` text
cursoAPI/
├── .env
├── package.json
├── apps.js
└── src/
    ├── config/
    │   └── db.js
    ├── controllers/
    │   └── usuario.controller.js
    ├── repositories/
    │   └── usuario.repository.js
    ├── services/
    │   └── usuario.service.js
    ├── routes/
    │   └── usuario.routes.js
    ├── middlewares/
    │   ├── error.middleware.js
    │   └── validate.middleware.js
    ├── schemas/
    │   └── usuario.schema.js
    └── utils/
        └── AppError.js
```

A conexão com PostgreSQL foi configurada e testada, incluindo
`SELECT NOW()`. As credenciais ficam em `.env` e não devem ser
partilhadas.

### Tabela `usuarios` conhecida

``` sql
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  idade INTEGER NOT NULL
);
```

**Importante:** ainda não foi confirmado que uma coluna de senha tenha
sido adicionada. Confirmar o estado real da tabela antes de implementar
a autenticação.

### CRUD concluído

``` text
GET    /usuarios
GET    /usuarios/:id
POST   /usuarios
PUT    /usuarios/:id
DELETE /usuarios/:id
```

O CRUD foi testado no Postman e usa PostgreSQL real, queries
parametrizadas, `RETURNING *` e `resultado.rows[0]`.

### Arquitetura compreendida

``` text
Route
  ↓
Controller — HTTP, req/res
  ↓
Service — regras de negócio e coordenação
  ↓
Repository — consultas SQL e persistência
  ↓
PostgreSQL
```

O estudante já compreende a separação de responsabilidades entre as
camadas.

### Tratamento de erros

Foi implementada uma classe `AppError` com `statusCode` e suporte a
`details` para erros de validação. A forma exata dos ficheiros atuais
deve ser verificada antes de alterar o código.

O middleware global centraliza as respostas de erro. O estudante também
observou a propagação automática de erros em handlers assíncronos no
Express 5; confirmar a versão instalada antes de generalizar esse
comportamento para outras versões.

### Zod e validação

O estudante praticou: - `safeParse()`, `success`, `data` e
`error.issues`; - extração de `path` e `message`; - mensagens de
validação personalizadas; - middleware que valida `req.body`; -
encaminhamento de erros de validação através de `AppError`; - regras
para IDs e dados de utilizadores.

### Atualização parcial de utilizador --- decisão atual

O Repository escolhe a query SQL de acordo com os campos recebidos: -
`nome` e `idade`: atualiza ambos; - apenas `nome`: atualiza somente o
nome; - apenas `idade`: atualiza somente a idade.

O estudante ajustou a validação para aceitar os três cenários e
confirmou que funciona. Não substituir essa lógica por uma atualização
que exija sempre os dois campos sem discutir primeiro a decisão.

## 6. Mini-projeto de consolidação: `apiGestorDeTarefa`

O estudante concluiu um mini-projeto de tarefas com Node.js, Express e
PostgreSQL.

Tabela conhecida:

``` sql
CREATE TABLE tarefas (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  concluida BOOLEAN NOT NULL DEFAULT FALSE,
  prioridade INT,
  criada_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

Endpoints implementados:

``` text
GET    /tarefas
GET    /tarefas/:id
POST   /tarefas
PUT    /tarefas/:id
DELETE /tarefas/:id
GET    /tarefas/prioridade/:prioridade
GET    /tarefas/concluida/:concluida
```

O projeto foi usado para consolidar validação, operações SQL,
arquitetura em camadas, conversão de parâmetros e regras de negócio.

## 7. Domínio para exercícios futuros

Usar pequenos exemplos que possam evoluir gradualmente. A recomendação
principal é **gestão de tarefas e projetos**, por já ser familiar ao
estudante: - Utilizadores - Projetos - Tarefas - Categorias -
Comentários

Outras opções para exercícios específicos: gestão de inventário
(produtos, categorias, fornecedores, movimentos de stock) e gestão de
formações (formações, estudantes, inscrições, módulos).

Não é necessário implementar todas estas entidades agora. Escolher
apenas o recorte que melhor ensina a tecnologia de cada etapa.

## 8. Projeto final --- reservado para o fim

No final, criar um projeto robusto que reúna as bases e tecnologias
estudadas. Poderá incluir: - API organizada por responsabilidades; -
PostgreSQL e ORM; - validação e tratamento consistente de erros; -
autenticação e autorização; - testes automatizados; - documentação; -
configuração de ambiente e preparação para deployment.

O escopo detalhado será definido quando as etapas intermédias estiverem
concluídas. Não antecipar o projeto completo.

## 9. Instruções para retomar noutra conversa

1.  Consultar este ficheiro e o Ficheiro de Aprendizagem.
2.  Retomar pela **autenticação e segurança com bcrypt**, salvo se o
    estudante indicar que essa etapa já foi concluída.
3.  Confirmar o estado atual da tabela `usuarios` e dos ficheiros
    relevantes antes de editar.
4.  Ensinar primeiro hashing, depois cadastro, login, JWT, middleware e
    autorização.
5.  Depois seguir para TypeScript, NestJS, ORM e testes automatizados.
6.  Guardar o projeto robusto de integração para a última fase.
