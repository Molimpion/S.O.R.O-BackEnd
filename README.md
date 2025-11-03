# Projeto Integrador - Painel Web Bombeiros (Backend)

**Repositório do Backend da Aplicação S.O.R.O.**

---

*Projeto Integrador da Turma 44 da Faculdade Senac Pernambuco.*
*Professores Responsáveis: Danilo Farias, Geraldo Gomes, Marcos Tenorio e Sônia Gomes.*

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) [![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com)

## 1. Visão Geral

Este repositório contém o código-fonte do backend para o Painel Web do Projeto Bombeiros (S.O.R.O.). Trata-se de uma API RESTful robusta, segura e escalável, projetada para gerir utilizadores, ocorrências, logs de auditoria e todas as entidades de suporte necessárias para a operação, com base no Modelo Entidade-Relacionamento (MER) fornecido.

**API ao vivo:** [https://api-bombeiros-s-o-r-o.onrender.com](https://api-bombeiros-s-o-r-o.onrender.com)

**Documentação da API:** [https://api-bombeiros-s-o-r-o.onrender.com/api/docs/](https://api-bombeiros-s-o-r-o.onrender.com/api/docs/)

## 2. Estado do Projeto

A implementação de todos os requisitos funcionais do backend foi **concluída, validada e implementada em produção**.

- [x] **W-01 | Login & Perfis:** Completo.
- [x] **W-02 | Lista & Filtros de Ocorrências:** Completo.
- [x] **W-03 | Visualização de Detalhe:** Completo.
- [x] **W-04 | Relatórios Básicos & Exportação (CSV/PDF):** Completo.
- [x] **W-05 | Gestão de Utilizadores:** Completo.
- [x] **W-06 | Auditoria & Logs:** Completo.
- [x] **W-07 | Dashboard Operacional (KPI simples):** Completo.
- [ ] **W-08 | Catálogo/Form Builder:** Fora do escopo atual (marcado como "Futuro").

## 3. Arquitetura e Decisões de Design

A aplicação segue o padrão de **Monólito com Camadas (Layered Monolith)**. Esta abordagem foi escolhida para maximizar a agilidade no desenvolvimento inicial, enquanto o design modular interno (separação em `serviços`, `controladores`, `rotas`) mantém o projeto alinhado com os princípios de uma Arquitetura Orientada a Serviços (SOA), permitindo uma fácil evolução futura.

- **Framework Web:** Express.js
- **Banco de Dados:** PostgreSQL
- **ORM:** Prisma
- **Segurança:** Autenticação via Tokens JWT (`jsonwebtoken`) e criptografia de senhas com `bcrypt`.
- **Validação:** Validação robusta de dados de entrada com `zod`.
- **Tratamento de Erros:** Sistema centralizado com Erros Customizados e um Middleware de Erro global.

### Ambiente de Desenvolvimento Padronizado

O projeto utiliza a especificação **Dev Container** (`.devcontainer`) para definir e automatizar o ambiente de desenvolvimento. Através do `docker-compose.yml`, ele orquestra dois contentores: um para a aplicação Node.js e outro para o banco de dados PostgreSQL. Isto garante que todos os programadores trabalhem com as mesmas versões de software, eliminando conflitos de ambiente ("na minha máquina funciona").

## 4. Como Executar o Projeto Localmente

1.  **Pré-requisitos:**
    * Git
    * Docker e Docker Compose
    * VS Code com a extensão **"Dev Containers"** instalada.

2.  **Inicialização:**
    * Clone este repositório.
    * Na raiz do projeto, crie um ficheiro chamado `.env` com o seguinte conteúdo para o ambiente local:
        ```env
        DATABASE_URL="postgresql://admin:supersecretpassword@postgres-db:5432/bombeiros_pi"
        JWT_SECRET="gere_uma_chave_secreta_forte_e_aleatoria_aqui"
        
        # --- Configuração do Serviço de E-mail (BREVO API) ---
        # Removidas as variáveis SMTP bloqueadas pelo Render
        # O EMAIL_FROM DEVE ESTAR VERIFICADO no painel do Brevo.
        BREVO_API_KEY=
        EMAIL_FROM="Nome do Remetente" <seu.email@verificado.com>
        ```
    * Abra a pasta do projeto no VS Code. O editor irá sugerir reabrir o projeto num contentor. Aceite.

3.  **Dentro do Ambiente Dev Container:**
    * Abra um terminal no VS Code.
    * Instale as dependências:
        ```bash
        npm install
        ```
    * Aplique as migrações para criar a estrutura do banco de dados. Para um ambiente limpo, use `reset`:
        ```bash
        npx prisma migrate reset
        ```
    * Inicie o servidor de desenvolvimento:
        ```bash
        npm run dev
        ```
    * O servidor estará a correr em `http://localhost:3000`.

## 5. Deployment

A aplicação está configurada para "deploy" contínuo na plataforma **Render**. Cada `push` para a "branch" `main` aciona um novo "build" e "deploy" automático.

O script de "build" (`build.sh`) realiza as seguintes ações no ambiente do Render:
1. Instala as dependências (`npm install`).
2. Aplica as migrações da base de dados (`npx prisma migrate deploy`).
3. Compila o código TypeScript para JavaScript (`npm run build`).

### Variáveis de Ambiente no Render
Para que a aplicação funcione em produção, as seguintes variáveis de ambiente devem ser configuradas no painel do serviço no Render:
- `DATABASE_URL`: Deve ser preenchido com o **Internal Connection URL** fornecido pelo serviço de base de dados do próprio Render.
- `JWT_SECRET`: Uma chave secreta forte e única para a geração dos tokens JWT em produção.
- **`BREVO_API_KEY`**: **(NOVA)** Chave API gerada no Brevo (substitui todas as variáveis SMTP).
- `EMAIL_FROM`: O e-mail de remetente no formato `"Nome" <email@exemplo.com>`. Este remetente **deve estar verificado** no painel do Brevo.

## 6. Testando a API

O projeto inclui um ficheiro `requests.http` com uma suíte de testes de ponta a ponta.

1.  **Pré-requisito:**
    * Instale a extensão **"REST Client"** (por Huachao Mao) no seu VS Code.

2.  **Passos para Testar:**
    * Garanta que o servidor esteja a correr (localmente ou em produção).
    * Abra o ficheiro `requests.http` e defina a variável `@hostname` para o ambiente que deseja testar (`http://localhost:3000` ou a URL do Render).
    * Execute as requisições na ordem apresentada.
    * Após executar os testes de login, copie os tokens `admin` e `analista` para as variáveis `@adminToken` e `@analistaToken` no topo do ficheiro.

## 7. Documentação da API

**NOTA:** Todos os endpoints agora estão versionados com o prefixo `/api/v1/`.

### Endpoints Principais

#### Autenticação (`/api/v1/auth`)
| Método | Endpoint | Descrição | Acesso |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Regista um novo utilizador. | Público |
| `POST` | `/login` | Autentica um utilizador e retorna um token JWT. | Público |

#### Ocorrências (`/api/v1/ocorrencias`)
| Método | Endpoint | Descrição | Acesso |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | Cria uma nova ocorrência. | Autenticado |
| `GET` | `/` | Lista ocorrências com filtros e paginação. | Autenticado |
| `GET` | `/:id` | Obtém os detalhes de uma ocorrência específica. | Autenticado |
| `PUT` | `/:id` | Atualiza uma ocorrência existente (só o dono). | Autenticado |

#### Gestão de Utilizadores (`/api/v1/users`)
| Método | Endpoint | Descrição | Acesso |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Lista todos os utilizadores. | Admin |
| `GET` | `/:id` | Obtém os detalhes de um utilizador. | Admin |
| `PUT` | `/:id` | Atualiza um utilizador. | Admin |
| `DELETE`| `/:id` | Deleta um utilizador. | Admin |

#### Relatórios e Dashboard
| Método | Endpoint | Descrição | Acesso |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/relatorios` | Gera um relatório (CSV/PDF) de ocorrências. | Admin |
| `GET` | `/api/v1/dashboard/ocorrencias-por-status` | Retorna o total de ocorrências por status. | Autenticado |
| `GET` | `/api/v1/dashboard/ocorrencias-por-tipo` | Retorna o total de ocorrências por tipo (subgrupo). | Autenticado |
| `GET` | `/api/v1/dashboard/ocorrencias-por-bairro` | Retorna o total de ocorrências por bairro. | Autenticado |

### Endpoints Administrativos (CRUDs de Suporte)
A API também inclui endpoints `POST`, `GET` e `DELETE` (protegidos por `/api/v1/` e `checkAdmin`) para que administradores possam gerir as seguintes entidades de suporte:
- `/api/v1/municipios`
- `/api/v1/bairros`
- `/api/v1/naturezas`
- `/api/v1/grupos`
- `/api/v1/subgrupos`
- `/api/v1/formas-acervo`
- `/api/v1/grupamentos`
- `/api/v1/unidades-operacionais`
- `/api/v1/viaturas`
