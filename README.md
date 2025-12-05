**Repositório do Backend da Aplicação S.O.R.O.**

-----

*Projeto Integrador da Turma 44 da Faculdade Senac Pernambuco.*
*Professores responsáveis: Danilo Farias, Geraldo Gomes, Marcos Tenorio e Sônia Gomes.*

### Framework e Ambiente Principal
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)

### Banco de Dados e ORM
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white) ![Neon](https://img.shields.io/badge/Neon-00E599?style=for-the-badge&logo=postgresql&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

### Infraestrutura e Observabilidade
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) ![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge&logo=prometheus&logoColor=white) ![Grafana](https://img.shields.io/badge/Grafana-F46800?style=for-the-badge&logo=grafana&logoColor=white) [![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com)

### Validação, Ferramentas e Documentação
![Zod](https://img.shields.io/badge/Zod-3068B7?style=for-the-badge&logo=zod&logoColor=white) ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white) ![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black) ![Scalar](https://img.shields.io/badge/Scalar-101827?style=for-the-badge&logo=openapiinitiative&logoColor=white) ![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)

-----

## 1\. Visão Geral

Este repositório contém o código-fonte do backend do Painel Web do Projeto Bombeiros (S.O.R.O.).
Trata-se de uma **API RESTful** robusta, segura e escalável, projetada para gerenciar usuários, ocorrências, logs de auditoria e todas as entidades de suporte necessárias à operação, com base no Modelo Entidade-Relacionamento (MER) fornecido.

**API ao vivo:** [https://api-bombeiros-s-o-r-o.onrender.com](https://api-bombeiros-s-o-r-o.onrender.com)

**Documentação (Scalar - Moderna):** [https://api-bombeiros-s-o-r-o.onrender.com/api/scalar/](https://api-bombeiros-s-o-r-o.onrender.com/api/scalar/)

**Documentação (Swagger - Clássica):** [https://api-bombeiros-s-o-r-o.onrender.com/api/docs/](https://api-bombeiros-s-o-r-o.onrender.com/api/docs/)

## 2\. Estado do Projeto

A implementação de todos os requisitos funcionais do backend foi **concluída, validada e implantada em produção**.

  * [x] **W-01 | Login & Perfis (Admin, Analista, Chefe, Operador de Campo):** Completo
  * [x] **W-02 | Lista & Filtros de Ocorrências:** Completo
  * [x] **W-03 | Visualização de Detalhes:** Completo
  * [x] **W-04 | Relatórios Básicos & Exportação (CSV/PDF):** Completo
  * [x] **W-05 | Gestão de Usuários:** Completo
  * [x] **W-06 | Auditoria & Logs:** Completo
  * [x] **W-07 | Dashboard Operacional (KPI simples):** Completo
  * [x] **(Novo) | Upload de Mídia:** Completo (via Cloudinary)
  * [x] **(Novo) | Notificações em Tempo Real:** Completo (via Socket.io)
  * [x] **(Novo) | Observabilidade (APM):** Completo (via Prometheus + Grafana + Sentry)

## 3\. Arquitetura e Decisões de Design

A aplicação segue o padrão **Monólito em Camadas (Layered Monolith)**.
Essa abordagem foi escolhida para maximizar a agilidade de desenvolvimento, mantendo ao mesmo tempo um design modular interno — com separação entre `serviços`, `controladores` e `rotas` — alinhado aos princípios de uma Arquitetura Orientada a Serviços (SOA).

  * **Framework Web:** Express.js
  * **Banco de Dados:** PostgreSQL (Neon Serverless)
  * **ORM:** Prisma
  * **Segurança (Autenticação):** Tokens JWT (`jsonwebtoken`) e criptografia com `bcrypt`
  * **Segurança (Headers):** `helmet` para proteção contra vulnerabilidades web (XSS, Clickjacking etc.)
  * **Comunicação em Tempo Real:** `socket.io` para notificações instantâneas ao frontend
  * **Serviço de E-mail:** **SendGrid** (via API HTTP, evitando bloqueios em plataformas como o Render)
  * **Upload de Mídia:** `cloudinary` e `multer` para gestão de uploads de imagens e vídeos
  * **Validação:** Validação robusta de dados com `zod`
  * **Qualidade de Código (Linting):** `ESLint` configurado para garantir padrões de código, consistência e evitar erros comuns.
  * **Documentação:** Suporte híbrido com **Swagger UI** (padrão de mercado) e **Scalar** (interface moderna e interativa).
  * **Logging:** Logging estruturado com `pino` e `pino-http`
  * **Monitoramento de Erros:** Rastreamento em produção com `Sentry`
  * **Monitoramento de Métricas (APM):** `Prometheus` (via `prom-client` para coleta) e `Grafana` (para visualização)
  * **Tratamento de Erros:** Sistema centralizado com erros personalizados e middleware global
  * **Configuração:** Variáveis de ambiente centralizadas e validadas em `src/config/environment.ts`

### Ambiente de Desenvolvimento Padronizado

O projeto utiliza **Dev Containers** (`.devcontainer`) para definir e automatizar o ambiente de desenvolvimento.
Através do `docker-compose.yml`, são orquestrados **três** contêineres: um para a aplicação Node.js (`app`), um para o banco de dados (`postgres-db`) e um para o coletor de métricas (`prometheus`).

## 4\. Como Executar o Projeto Localmente

### 1\. Pré-requisitos

  * Git
  * Docker e Docker Compose
  * VS Code com a extensão **"Dev Containers"**

### 2\. Inicialização

1.  Clone este repositório.
2.  Na raiz do projeto, crie um arquivo `.env` (já listado no `.gitignore`).
    Use `src/config/environment.ts` como referência para todas as chaves necessárias.

**Exemplo de `.env` local:**

```env
# Banco de dados (do docker-compose.yml)
DATABASE_URL="postgresql://admin:supersecretpassword@postgres-db:5432/bombeiros_pi"

# Segurança
JWT_SECRET="gere_uma_chave_secreta_forte_e_aleatoria_aqui"

# --- Configuração do Serviço de E-mail (SendGrid API) ---
SENDGRID_API_KEY=SUA_CHAVE_API_DO_SENDGRID
EMAIL_FROM="Sistema S.O.R.O." <seu.email.verificado@gmail.com>

# --- Configuração de Upload (Cloudinary) ---
CLOUDINARY_CLOUD_NAME=SEU_CLOUD_NAME
CLOUDINARY_API_KEY=SUA_API_KEY
CLOUDINARY_API_SECRET=SEU_API_SECRET

# --- Monitoramento (Opcional no dev) ---
SENTRY_DSN=SUA_DSN_DO_SENTRY
```

> **Nota sobre E-mail:** Como utilizamos um remetente gratuito verificado (`@gmail.com` ou similar), o e-mail de boas-vindas pode ser classificado como **spam**.
> Oriente os usuários a verificarem a caixa de spam.

3.  Abra a pasta do projeto no VS Code. O editor sugerirá reabrir o projeto em um contêiner — aceite.

### 3\. Dentro do Dev Container

Execute os seguintes comandos no terminal do VS Code:

```bash
npm install
```

Aplique as migrações (use `reset` para recriar o banco):

```bash
npx prisma migrate reset
```

Para verificar a qualidade do código com ESLint:

```bash
npm run lint      # Verifica erros
npm run lint:fix  # Tenta corrigir erros automaticamente
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`.
O servidor do Prometheus estará em `http://localhost:9090`.

## 5\. Populando o Banco de Dados (Seed)

O projeto inclui um script robusto de **Seed** (`src/seed.ts`) que popula o banco de dados com:

  * **20 Usuários de Teste:** 5 para cada perfil (Admin, Analista, Chefe, Operador de Campo).
  * **Estrutura Operacional:** Todos os Grupamentos, Unidades Operacionais e Viaturas do CBMPE.
  * **Dados Geográficos:** Municípios e Bairros da Região Metropolitana do Recife.
  * **Classificações:** Naturezas, Grupos e Subgrupos de ocorrências.

### Como Rodar (Ambiente Local)

Se você estiver rodando localmente com Docker, certifique-se de que seu `.env` tem a `DATABASE_URL` local e rode:

```bash
npx ts-node src/seed.ts
```

### Como Rodar (Produção / Neon)

Para popular o banco de produção sem alterar seu arquivo `.env`, passe a URL de conexão direta do Neon antes do comando:

```bash
DATABASE_URL="postgres://usuario:senha@host.neon.tech/neondb?sslmode=require" npx ts-node src/seed.ts
```

> **Credenciais Padrão:** Todos os usuários criados pelo seed têm a senha `123456`.
> Ex: `cel.moura@bombeiros.pe.gov.br` (Admin), `sd.nascimento@bombeiros.pe.gov.br` (Operador).

## 6\. Deployment (Render)

A aplicação está configurada para **deploy contínuo** na plataforma **Render**.
Cada `push` para a branch `main` aciona automaticamente um novo *build* e *deploy*.

A nossa implantação no Render é composta por **dois** Web Services:

### 1\. A API S.O.R.O. (`api-bombeiros-s-o-r-o`)

Este é o serviço principal da aplicação.

  * **Runtime:** `Node`
  * **Build Command:** `npm run build`
  * **Start Command:** `npm run start`
  * **Variáveis de Ambiente:**
      * `DATABASE_URL`: (Connection String do banco de dados Neon - PostgreSQL)
      * `JWT_SECRET`: (chave secreta forte e única para produção)
      * `SENDGRID_API_KEY`: (chave API do SendGrid)
      * `EMAIL_FROM`: (e-mail de remetente **verificado** no SendGrid)
      * `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
      * `SENTRY_DSN`: (DSN do projeto no Sentry)

### 2\. O Prometheus (`s-o-r-o-prometheus`)

Este serviço "raspa" (scrape) as métricas da API e as fornece ao Grafana.

  * **Runtime:** `Docker`
  * **Root Directory:** `./.render`
  * **Dockerfile Path:** `./Dockerfile.prometheus`
  * **Start Command:** (deixar em branco)

## 7\. Observabilidade (Prometheus + Grafana)

Além do Sentry (para erros) e Pino (para logs), a aplicação está configurada para monitoramento de métricas em tempo real.

  * **Endpoint:** A API expõe métricas de saúde e performance no endpoint público `/metrics`.
  * **Coleta:** No Render, um segundo serviço (`s-o-r-o-prometheus`) é responsável por "raspar" (scrape) este endpoint e armazenar os dados.
  * **Visualização:** O **Grafana Cloud** é usado para visualizar esses dados, conectando-se ao serviço `s-o-r-o-prometheus` do Render como fonte de dados.

## 8\. Testando a API

O projeto inclui o arquivo `api-tests/requests.http` com uma suíte de testes de ponta a ponta.

### Passos

1.  Instale a extensão **"REST Client"** (por Huachao Mao) no VS Code.
2.  Certifique-se de que o servidor está em execução (local ou produção).
3.  Abra `api-tests/requests.http`, defina `@hostname` e execute as requisições na ordem indicada.

## 9\. Documentação da API (Endpoints)

> **Atualização de Versão:** Os endpoints de Ocorrências, Dashboard e Tabelas Auxiliares foram atualizados para o prefixo **`/api/v2/`**. Autenticação, Usuários e Relatórios permanecem na **`/api/v1/`**.

### Autenticação (`/api/v1/auth`)

| Método | Endpoint    | Descrição                        | Acesso  |
| :----- | :---------- | :------------------------------- | :------ |
| `POST` | `/register` | Registra um novo usuário         | Público |
| `POST` | `/login`    | Autentica e retorna um token JWT | Público |

### Ocorrências (`/api/v2/ocorrencias`)

| Método | Endpoint     | Descrição                                 | Acesso             |
| :----- | :----------- | :---------------------------------------- | :----------------- |
| `POST` | `/`          | Cria uma nova ocorrência                  | Autenticado        |
| `GET`  | `/`          | Lista ocorrências com filtros e paginação | Autenticado        |
| `GET`  | `/:id`       | Obtém os detalhes de uma ocorrência       | Autenticado        |
| `PUT`  | `/:id`       | Atualiza uma ocorrência existente         | Autenticado (Role) |
| `POST` | `/:id/midia` | Faz upload de mídia (imagem/vídeo)        | Autenticado        |

### Gestão de Usuários (`/api/v1/users`)

| Método   | Endpoint | Descrição                        | Acesso |
| :------- | :------- | :------------------------------ | :----- |
| `GET`    | `/`      | Lista todos os usuários         | Admin  |
| `GET`    | `/:id`   | Obtém detalhes de um usuário    | Admin  |
| `PUT`    | `/:id`   | Atualiza um usuário             | Admin  |
| `DELETE` | `/:id`   | Remove um usuário               | Admin  |

### Relatórios e Dashboard

| Método | Endpoint                                    | Descrição                                  | Acesso      |
| :----- | :------------------------------------------ | :----------------------------------------- | :---------- |
| `GET`  | `/api/v1/relatorios`                        | Gera relatório (CSV/PDF) de ocorrências    | Admin       |
| `GET`  | `/api/v2/dashboard/ocorrencias-por-status`  | Total de ocorrências por status            | Autenticado |
| `GET`  | `/api/v2/dashboard/ocorrencias-por-tipo`    | Total de ocorrências por tipo              | Autenticado |
| `GET`  | `/api/v2/dashboard/ocorrencias-por-bairro`  | Total de ocorrências por bairro            | Autenticado |
| `GET`  | `/api/v2/dashboard/ocorrencias-por-municipio` | Total de ocorrências por município (Pizza) | Autenticado |
| `GET`  | `/api/v2/dashboard/ocorrencias-por-periodo`   | Evolução temporal das ocorrências (Linha)  | Autenticado |
| `GET`  | `/api/v2/dashboard/avg-completion-time`       | Tempo médio de conclusão por tipo (Barra)  | Autenticado |

### Endpoints Administrativos e Auxiliares

A API inclui endpoints para as entidades de suporte.
**Importante:** Os métodos `GET` são liberados para todos os usuários autenticados (para preenchimento de formulários), enquanto `POST`, `PUT` e `DELETE` são restritos a **Admins**.

  * `/api/v2/municipios`
  * `/api/v2/bairros`
  * `/api/v2/naturezas`
  * `/api/v2/grupos`
  * `/api/v2/subgrupos`
  * `/api/v2/formas-acervo`
  * `/api/v2/grupamentos`
  * `/api/v2/unidades-operacionais`
  * `/api/v2/viaturas`

## 10\. Eventos em Tempo Real (Socket.io)

A API emite eventos via **Socket.io** para que o frontend atualize suas interfaces em tempo real.
Os clientes devem "ouvir" (`io.on(...)`) os seguintes eventos:

| Evento Emitido                  | Acionado por                         | Dados Enviados         |
| :------------------------------ | :----------------------------------- | :--------------------- |
| `nova_ocorrencia`               | `POST /ocorrencias`                  | `Ocorrencia`           |
| `ocorrencia_atualizada`         | `PUT /ocorrencias/:id`               | `Ocorrencia`           |
| `media_adicionada`              | `POST /ocorrencias/:id/midia`        | `Midia & ocorrenciaId` |
| `lista_usuarios_atualizada`     | `PUT/DELETE /users/:id`              | `{ action, data }`     |
| `lista_viaturas_atualizada`     | `POST/PUT/DELETE /viaturas`          | `{ action, data }`     |
| `lista_bairros_atualizada`      | `POST/PUT/DELETE /bairros`           | `{ action, data }`     |
| `lista_municipios_atualizada`   | `POST/PUT/DELETE /municipios`        | `{ action, data }`     |
| `lista_grupamentos_atualizada`  | `POST/DELETE /grupamentos`           | `{ action, data }`     |
| `lista_unidades_atualizada`     | `POST/DELETE /unidades-operacionais` | `{ action, data }`     |
| `lista_naturezas_atualizada`    | `POST/DELETE /naturezas`             | `{ action, data }`     |
| `lista_grupos_atualizada`       | `POST/DELETE /grupos`                | `{ action, data }`     |
| `lista_subgrupos_atualizada`    | `POST/DELETE /subgrupos`             | `{ action, data }`     |
| `lista_formasacervo_atualizada` | `POST/DELETE /formas-acervo`         | `{ action, data }`     |


