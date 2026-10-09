# Ficheiro de Aprendizagem --- Backend

**Finalidade:** registar o que o estudante já praticou, o que ainda está
por estudar e como devem ser organizadas as próximas etapas.

## 1. Método de aprendizagem

O estudante prefere explicações em português, progressivas e práticas.
Para cada conceito novo: 1. explicar o que é; 2. explicar por que é
necessário; 3. mostrar um exemplo pequeno; 4. implementar passo a passo;
5. testar e analisar o resultado; 6. propor uma parte para o estudante
resolver; 7. registar o que foi consolidado.

Não entregar uma aplicação inteira de uma vez quando o objetivo for
aprender. Rever o código atual antes de sugerir mudanças grandes e
evitar repetir fundamentos já dominados sem necessidade.

## 2. Competências praticadas

### Node.js e Express

-   criação e organização de uma API;
-   routers e endpoints HTTP;
-   `req.params`, `req.body` e respostas com `res.status().json()`;
-   middleware de JSON;
-   funções assíncronas;
-   middleware de validação e middleware global de erros.

### PostgreSQL e SQL

-   criação de tabelas e escolha de tipos;
-   chaves primárias, `NOT NULL` e valores `DEFAULT`;
-   `SELECT`, `INSERT`, `UPDATE` e `DELETE`;
-   queries parametrizadas com `$1`, `$2`, etc.;
-   `RETURNING *`;
-   `resultado.rows` e `resultado.rows[0]`;
-   conexão através de `pg`/`Pool`;
-   configuração com `.env`.

### Arquitetura

O estudante praticou a separação: - **Routes:** associam caminhos e
métodos a middlewares/controllers. - **Controllers:** lidam com o pedido
e a resposta HTTP. - **Services:** aplicam regras de negócio e coordenam
operações. - **Repositories:** executam consultas e operações de
persistência. - **Schemas/Middlewares:** validam dados de entrada. -
**Error Middleware:** centraliza respostas de erro.

### Validação e erros

-   `AppError` com `statusCode` e detalhes opcionais;
-   middleware global de erros;
-   Zod com `safeParse()`;
-   `error.issues`, `path` e `message`;
-   mensagens personalizadas;
-   middleware de validação;
-   validação de IDs e dados de entrada.

### Atualização parcial

O estudante implementou a escolha de queries de atualização conforme os
campos enviados: - nome e idade; - somente nome; - somente idade.

A validação foi adaptada para estes três cenários e o estudante
confirmou que está a funcionar.

### Projetos de prática

-   `cursoAPI`: CRUD de utilizadores com Express e PostgreSQL.
-   `apiGestorDeTarefa`: API de tarefas com CRUD, filtros por prioridade
    e estado, validações e arquitetura em camadas.

## 3. Roteiro pedagógico acordado

### Etapa 1 --- Base de backend

**Estado:** consolidada através dos projetos de prática.

Node.js, Express, PostgreSQL, CRUD, arquitetura em camadas, Zod e
tratamento de erros.

### Etapa 2 --- Autenticação e segurança

**Próxima etapa.**

Conteúdos: 1. hashing de senhas com bcrypt; 2. cadastro seguro; 3. login
e comparação com `bcrypt.compare()`; 4. JWT; 5. middleware de
autenticação; 6. proteção de rotas; 7. autenticação versus autorização;
8. permissões/perfis quando adequado.

Começar por explicar por que não se guardam senhas em texto simples.
Antes de alterar o banco, verificar a estrutura atual da tabela
`usuarios`. Não assumir que a coluna de senha já existe.

### Etapa 3 --- TypeScript aplicado ao backend

-   tipos e inferência;
-   interfaces e aliases de tipos;
-   tipagem de funções e objetos;
-   tipagem de pedidos/respostas e integração com Express;
-   aplicação gradual ao código backend.

Aproveitar o conhecimento de JavaScript, sem recomeçar do zero.

### Etapa 4 --- NestJS

-   módulos;
-   controllers;
-   providers e services;
-   injeção de dependências;
-   DTOs e Pipes;
-   organização da aplicação;
-   comparação com a arquitetura Express construída manualmente.

### Etapa 5 --- ORM

Escolher Prisma ou TypeORM quando a etapa se aproximar. - modelos e
relações; - migrations; - consultas e operações de persistência; -
comparação entre ORM e SQL direto.

A escolha ainda não está fechada.

### Etapa 6 --- Testes automatizados

-   testes unitários;
-   testes de integração;
-   mocks;
-   testes de endpoints;
-   ferramentas possíveis: Jest ou Vitest e Supertest.

A escolha das ferramentas deve ser feita na altura desta etapa,
considerando a stack final.

### Etapa 7 --- Projeto final robusto

Construir no final do curso um projeto que integre as tecnologias
estudadas, inclua autenticação e autorização quando apropriado,
validação, tratamento de erros, testes automatizados, documentação e
preparação para deployment.

## 4. Entidades sugeridas para exercícios

### Domínio principal recomendado: gestão de tarefas e projetos

-   **Utilizador:** dados de perfil e, na etapa de segurança,
    autenticação.
-   **Projeto:** nome, descrição e estado.
-   **Tarefa:** título, descrição, estado, prioridade e data.
-   **Categoria:** classificação das tarefas.
-   **Comentário:** conteúdo, autor e data.

Este domínio é familiar porque o estudante já desenvolveu uma API de
tarefas. Pode crescer aos poucos sem exigir a implementação de todas as
entidades em cada etapa.

### Alternativas para exercícios específicos

**Gestão de inventário:** produtos, categorias, fornecedores e
movimentos de stock.

**Gestão de formações:** formações, estudantes, inscrições e módulos.

Estas alternativas são recursos didáticos, não projetos que precisam de
ser construídos integralmente.

## 5. Competências ainda não confirmadas como concluídas

-   bcrypt integrado no cadastro;
-   login e comparação de senhas;
-   JWT;
-   middleware de autenticação;
-   rotas protegidas;
-   autorização e perfis;
-   TypeScript aplicado ao backend;
-   NestJS;
-   ORM;
-   testes automatizados;
-   projeto final integrado.

Uma dependência instalada não é prova de que a tecnologia foi aprendida
ou aplicada.

## 6. Regras para manter o progresso

-   Não começar já o projeto final.
-   Não implementar todas as entidades de exemplo de uma vez.
-   Escolher um exercício pequeno por tecnologia.
-   Confirmar o comportamento com testes manuais durante a aprendizagem.
-   Reservar a suite de testes automatizados estruturada para a etapa
    prevista no roteiro.
-   Atualizar os ficheiros de Continuidade e de Aprendizagem quando o
    progresso ou o escopo mudar.
-   Se o estudante retomar noutra conversa, ler estes ficheiros e
    continuar da próxima etapa pendente, sem adivinhar o estado do
    código.
