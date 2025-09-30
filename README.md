# Projeto Integrador - Painel Web Bombeiros

**Backend da Aplicação**

---

*Projeto Integrador da Turma 44 da Faculdade Senac Pernambuco.*
*Professores Responsáveis: Danilo Farias, Geraldo Gomes e Marcos Tenorio.*

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

## 1. Visão Geral

Este repositório contém o código-fonte do backend para o Painel Web do Projeto Bombeiros. Trata-se de uma API RESTful robusta, segura e escalável, projetada para gerenciar usuários, ocorrências, logs de auditoria e outras funcionalidades da aplicação.

## 2. Funcionalidades Implementadas (Backend)

-   [x] **W-01: Sistema de Autenticação e Perfis:** Cadastro e login seguros com senhas criptografadas e autenticação via Tokens JWT.
-   [x] **W-05: Gestão de Usuários:** Endpoints CRUD para que administradores possam gerenciar os usuários do sistema, com acesso protegido por nível de permissão.
-   [x] **W-06: Auditoria e Logs:** Sistema automatizado que registra eventos críticos da aplicação (logins, falhas de login, alterações de dados) para fins de rastreabilidade.
-   [x] **Validação de Dados:** Implementação de validação de entrada em todas as rotas para garantir a integridade dos dados.
-   [ ] **W-02, W-03, W-04, W-07 (Ocorrências, Relatórios, Dashboard):** A estrutura de esqueleto está pronta, aguardando a finalização do modelo de dados (MER/EER) para implementação.

## 3. Arquitetura e Tecnologias

A aplicação foi desenvolvida em **TypeScript** sobre a plataforma **Node.js**, seguindo a arquitetura de **Monólito com Camadas (Layered Monolith)**. Esta abordagem foi escolhida para combinar a agilidade de desenvolvimento inicial com a organização e escalabilidade futura de uma Arquitetura Orientada a Serviços (SOA).

-   **Framework Web:** Express.js
-   **Banco de Dados:** MySQL
-   **ORM (Object-Relational Mapper):** Prisma
-   **Segurança:** `jsonwebtoken` para tokens JWT e `bcrypt` para hash de senhas.
-   **Validação:** `zod`
-   **Ambiente:** O projeto é totalmente containerizado com **Docker** e **Docker Compose**, gerenciado através da especificação **Dev Container** para uso no GitHub Codespaces ou localmente.

## 4. Configuração do Ambiente de Desenvolvimento

Para executar este projeto, siga os passos abaixo.

1.  **Pré-requisitos:**
    * Git
    * Docker e Docker Compose
    * VS Code com a extensão **"Dev Containers"**

2.  **Inicialização:**
    * Clone este repositório.
    * Na raiz do projeto, crie um arquivo chamado `.env` baseado no arquivo `.env.example` (se houver) ou use o conteúdo abaixo:
        ```env
        DATABASE_URL="mysql://root:rootpassword@db:3306/bombeiros_pi"
        JWT_SECRET="gere_uma_chave_secreta_forte_e_aleatoria_aqui"
        ```
    * Abra o projeto no VS Code. O editor irá sugerir reabrir o projeto em um contêiner. Aceite. (Ou abra a paleta de comandos com `Ctrl+Shift+P` e selecione `Dev Containers: Reopen in Container`).

3.  **Dentro do Ambiente Dev Container:**
    * Abra um terminal no VS Code.
    * Instale as dependências:
        ```bash
        npm install
        ```
    * Aplique as migrações do banco de dados para criar as tabelas:
        ```bash
        npx prisma migrate dev
        ```
    * Inicie o servidor de desenvolvimento:
        ```bash
        npm run dev
        ```
    * O servidor estará rodando em `http://localhost:3000`.

## 5. Testando a API com o `requests.http`

O projeto inclui um arquivo `requests.http` com uma suíte de testes completa para todas as funcionalidades implementadas.

1.  **Pré-requisito:**
    * Instale a extensão **"REST Client"** (por Huachao Mao) no seu VS Code.

2.  **Passos para Testar:**
    * Garanta que o servidor de desenvolvimento esteja rodando (`npm run dev`).
    * Abra o arquivo `requests.http` no editor.
    * O arquivo utiliza variáveis para facilitar os testes. No topo, você encontrará:
        ```http
        @adminToken = 
        @analistaToken = 
        @userId = 
        ```
    * **Execute as requisições na ordem**, clicando no link `"Send Request"` que aparece acima de cada bloco:
        a. **Execute os testes de cadastro (1.1 e 1.2)** para criar os usuários de teste.
        b. **Execute os testes de login (2.1 e 2.2)**. Copie os tokens JWT recebidos na resposta e cole-os nas variáveis `@adminToken` e `@analistaToken` correspondentes no topo do arquivo.
        c. **Execute o teste de listagem (3.1)**. Na resposta, copie o `id` de um dos usuários e cole na variável `@userId` no topo do arquivo.
        d. Agora, você pode executar todos os outros testes (`obter detalhes`, `atualizar`, `deletar`, `testes de segurança`), pois as variáveis já estarão preenchidas.

Este arquivo serve como uma documentação viva e um método prático para validar todas as funcionalidades da API.