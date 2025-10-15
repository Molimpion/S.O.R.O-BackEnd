# Projeto Integrador - Painel Web Bombeiros (Backend)

**Repositório do Backend da Aplicação S.O.R.O.**

---

*Projeto Integrador da Turma 44 da Faculdade Senac Pernambuco.*
*Professores Responsáveis: Danilo Farias, Geraldo Gomes, Marcos Tenorio e Sônia Gomes.*

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

## 1. Visão Geral

Este repositório contém o código-fonte do backend para o Painel Web do Projeto Bombeiros (S.O.R.O.). [cite_start]Trata-se de uma API RESTful robusta, segura e escalável, projetada para gerir utilizadores, ocorrências, logs de auditoria e todas as entidades de suporte necessárias para a operação, com base no Modelo Entidade-Relacionamento (MER) fornecido[cite: 96, 124].

## 2. Estado do Projeto

A implementação de todos os requisitos funcionais do backend foi **concluída e validada** através de uma suíte de testes de ponta a ponta.

-   [x] **W-01 | Login & Perfis:** Completo.
-   [x] **W-02 | Lista & Filtros de Ocorrências:** Completo.
-   [x] **W-03 | Visualização de Detalhe:** Completo.
-   [x] **W-04 | Relatórios Básicos & Exportação (CSV/PDF):** Completo.
-   [x] **W-05 | Gestão de Utilizadores:** Completo.
-   [x] **W-06 | Auditoria & Logs:** Completo.
-   [x] **W-07 | Dashboard Operacional (KPI simples):** Completo.
-   [ ] **W-08 | Catálogo/Form Builder:** Fora do escopo atual (marcado como "Futuro").

## 3. Arquitetura e Decisões de Design

A aplicação segue o padrão de **Monólito com Camadas (Layered Monolith)**. Esta abordagem foi escolhida para maximizar a agilidade no desenvolvimento inicial, enquanto o design modular interno (separação em `serviços`, `controladores`, `rotas`) mantém o projeto alinhado com os princípios de uma Arquitetura Orientada a Serviços (SOA), permitindo uma fácil evolução futura.

-   **Framework Web:** Express.js
-   **Banco de Dados:** PostgreSQL
-   **ORM:** Prisma
-   **Segurança:** Autenticação via Tokens JWT (`jsonwebtoken`) e criptografia de senhas com `bcrypt`.
-   **Validação:** Validação robusta de dados de entrada com `zod`.
-   **Tratamento de Erros:** Sistema centralizado com Erros Customizados e um Middleware de Erro global.

### Ambiente de Desenvolvimento Padronizado

O projeto utiliza a especificação **Dev Container** (`.devcontainer`) para definir e automatizar o ambiente de desenvolvimento. Através do `docker-compose.yml`, ele orquestra dois contentores: um para a aplicação Node.js e outro para o banco de dados PostgreSQL. Isto garante que todos os programadores trabalhem com as mesmas versões de software, eliminando conflitos de ambiente ("na minha máquina funciona").

## 4. Como Executar o Projeto

1.  **Pré-requisitos:**
    * Git
    * Docker e Docker Compose
    * VS Code com a extensão **"Dev Containers"** instalada.

2.  **Inicialização:**
    * Clone este repositório.
    * Na raiz do projeto, crie um ficheiro chamado `.env` com o seguinte conteúdo:
        ```env
        DATABASE_URL="postgresql://admin:supersecretpassword@postgres-db:5432/bombeiros_pi"
        JWT_SECRET="gere_uma_chave_secreta_forte_e_aleatoria_aqui"
        ```
    * Abra a pasta do projeto no VS Code. O editor irá sugerir reabrir o projeto num contentor. Aceite.

3.  **Dentro do Ambiente Dev Container:**
    * Abra um terminal no VS Code.
    * Instale as dependências:
        ```bash
        npm install
        ```
    * Aplique as migrações para criar a estrutura do banco de dados:
        ```bash
        npx prisma migrate dev
        ```
    * Inicie o servidor de desenvolvimento:
        ```bash
        npm run dev
        ```
    * O servidor estará a correr em `http://localhost:3000`.

## 5. Testando a API

O projeto inclui um ficheiro `requests.http` com uma suíte de testes de ponta a ponta.

1.  **Pré-requisito:**
    * Instale a extensão **"REST Client"** (por Huachao Mao) no seu VS Code.

2.  **Passos para Testar:**
    * Garanta que o servidor esteja a correr (`npm run dev`). Para um teste limpo, é recomendado resetar o banco de dados antes com `npx prisma migrate reset`.
    * Abra o ficheiro `requests.http`.
    * Execute as requisições na ordem apresentada, de cima para baixo.
    * Após executar os testes de login (Fase 1), copie os tokens `admin` e `analista` para as variáveis `@adminToken` e `@analistaToken` no topo do ficheiro. As requisições seguintes usarão estas variáveis automaticamente para se autenticar.

## 6. Documentação da API

### Endpoints Principais

#### Autenticação (`/api/auth`)
| Método | Endpoint | Descrição | Acesso |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Regista um novo utilizador. | Público |
| `POST` | `/login` | Autentica um utilizador e retorna um token JWT. | Público |

#### Ocorrências (`/api/ocorrencias`)
| Método | Endpoint | Descrição | Acesso |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | Cria uma nova ocorrência. | Autenticado |
| `GET` | `/` | Lista ocorrências com filtros e paginação. | Autenticado |
| `GET` | `/:id` | Obtém os detalhes de uma ocorrência específica. | Autenticado |

#### Gestão de Utilizadores (`/api/users`)
| Método | Endpoint | Descrição | Acesso |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Lista todos os utilizadores. | Admin |
| `GET` | `/:id` | Obtém os detalhes de um utilizador. | Admin |
| `PUT` | `/:id` | Atualiza um utilizador. | Admin |
| `DELETE`| `/:id` | Deleta um utilizador. | Admin |

#### Relatórios e Dashboard
| Método | Endpoint | Descrição | Acesso |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/relatorios/ocorrencias/csv` | Gera um relatório CSV de ocorrências. | Admin |
| `GET` | `/api/relatorios/ocorrencias/pdf` | Gera um relatório PDF de ocorrências. | Admin |
| `GET` | `/api/dashboard/ocorrencias-por-status` | Retorna o total de ocorrências por status. | Autenticado |
| `GET` | `/api/dashboard/ocorrencias-por-tipo` | Retorna o total de ocorrências por tipo (subgrupo). | Autenticado |
| `GET` | `/api/dashboard/ocorrencias-por-bairro` | Retorna o total de ocorrências por bairro. | Autenticado |

### Endpoints Administrativos (CRUDs de Suporte)
A API também inclui endpoints `POST`, `GET` e `DELETE` para que administradores possam gerir as seguintes entidades de suporte:
-   `/api/bairros`
-   `/api/naturezas`
-   `/api/grupos`
-   `/api/subgrupos`
-   `/api/formas-acervo`
-   `/api/grupamentos`
-   `/api/unidades-operacionais`
-   `/api/viaturas`
