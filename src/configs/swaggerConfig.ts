import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API S.O.R.O - Bombeiros",
      version: "1.0.0",
      description:
        "Documentação da API S.O.R.O. para gerenciamento de ocorrências, usuários, viaturas e recursos.",
      contact: {
        name: "Equipe Backend S.O.R.O.",
        email: "desenvolvimento@bombeiros.pe.gov.br",
      },
    },
    servers: [
      {
        url: "https://api-bombeiros-s-o-r-o.onrender.com",
        description: "Servidor de Produção (Render)",
      },
      {
        url: "http://localhost:3000",
        description: "Servidor de Desenvolvimento Local",
      },
    ],
    tags: [
      {
        name: "Autenticação",
        description: "Endpoints para registro e login de usuários",
      },
      {
        name: "Ocorrências",
        description:
          "Endpoints para gerenciamento de ocorrências (acessível por Analistas, Chefes, Operadores de Campo e Admins).",
      },
      {
        name: "Dashboard",
        description: "Endpoints para visualização de KPIs e dados analíticos.",
      },
      {
        name: "Relatórios",
        description:
          "(Admin) Endpoints para exportação de dados em CSV ou PDF.",
      },
      {
        name: "Gestão de Usuários",
        description: "(Admin) Endpoints para gerenciar usuários do sistema.",
      },
      {
        name: "Admin: Municípios",
        description: "(Admin) Endpoints para gerenciar os municípios.",
      },
      {
        name: "Admin: Bairros",
        description: "(Admin) Endpoints para gerenciar os bairros.",
      },
      {
        name: "Admin: Classificação (Natureza, Grupo, Subgrupo)",
        description:
          "(Admin) Endpoints para gerenciar a hierarquia de classificação das ocorrências.",
      },
      {
        name: "Admin: Formas de Acervo",
        description:
          "(Admin) Endpoints para gerenciar as formas de acionamento (ex: 193).",
      },
      {
        name: "Admin: Organização (Grupamentos e Unidades)",
        description:
          "(Admin) Endpoints para gerenciar a estrutura organizacional (Grupamentos e Unidades Operacionais).",
      },
      {
        name: "Admin: Viaturas",
        description: "(Admin) Endpoints para gerenciar as viaturas.",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Token JWT obtido no login (Ex: Bearer eyJhbGci...)",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            nome: { type: "string" },
            email: { type: "string", format: "email" },
            matricula: { type: "string" },
            tipo_perfil: {
              type: "string",
              enum: ["ADMIN", "ANALISTA", "CHEFE", "OPERADOR_CAMPO"],
            },
            nome_guerra: { type: "string", nullable: true },
            posto_grad: { type: "string", nullable: true },
            id_unidade_operacional_fk: {
              type: "string",
              format: "uuid",
              nullable: true,
            },
          },
        },
        UserInput: {
          type: "object",
          required: ["nome", "email", "matricula", "tipo_perfil"],
          properties: {
            nome: { type: "string" },
            email: { type: "string", format: "email" },
            password: {
              type: "string",
              format: "password",
              description:
                "Opcional no registro (será gerada e enviada por email). Obrigatória no login.",
            },
            matricula: { type: "string" },
            tipo_perfil: {
              type: "string",
              enum: ["ADMIN", "ANALISTA", "CHEFE", "OPERADOR_CAMPO"],
            },
            nome_guerra: { type: "string", nullable: true },
            posto_grad: { type: "string", nullable: true },
            id_unidade_operacional_fk: {
              type: "string",
              format: "uuid",
              nullable: true,
            },
          },
        },
        Ocorrencia: {
          type: "object",
          properties: {
            id_ocorrencia: { type: "string", format: "uuid" },
            nr_aviso: { type: "string", nullable: true },
            data_acionamento: { type: "string", format: "date-time" },
            hora_acionamento: { type: "string", format: "date-time" },
            status_situacao: {
              type: "string",
              enum: ["PENDENTE", "EM_ANDAMENTO", "CONCLUIDO", "CANCELADO"],
            },
            data_execucao_servico: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
            relacionado_eleicao: { type: "boolean" },
            id_subgrupo_fk: { type: "string", format: "uuid" },
            id_bairro_fk: { type: "string", format: "uuid" },
            id_forma_acervo_fk: { type: "string", format: "uuid" },
            id_usuario_abertura_fk: { type: "string", format: "uuid" },
          },
        },
        OcorrenciaInput: {
          type: "object",
          required: [
            "data_acionamento",
            "hora_acionamento",
            "id_subgrupo_fk",
            "id_bairro_fk",
            "id_forma_acervo_fk",
          ],
          properties: {
            data_acionamento: { type: "string", format: "date-time" },
            hora_acionamento: { type: "string", format: "date-time" },
            id_subgrupo_fk: { type: "string", format: "uuid" },
            id_bairro_fk: { type: "string", format: "uuid" },
            id_forma_acervo_fk: { type: "string", format: "uuid" },
            nr_aviso: { type: "string", nullable: true },
            observacoes: {
              type: "string",
              description: "Relato inicial da ocorrência",
            },
            localizacao: {
              type: "object",
              description: "Dados de geolocalização e endereço",
              properties: {
                logradouro: { type: "string" },
                tipo_logradouro: { type: "string" },
                numero_km: { type: "string" },
                referencia_logradouro: { type: "string" },
                latitude: { type: "number", format: "float" },
                longitude: { type: "number", format: "float" },
              },
            },
          },
        },
        Grupamento: {
          type: "object",
          required: ["nome_grupamento", "sigla"],
          properties: {
            id_grupamento: { type: "string", format: "uuid" },
            nome_grupamento: {
              type: "string",
              example: "Grupamento de Bombeiros Metropolitano",
            },
            sigla: { type: "string", example: "GBM" },
          },
        },
        UnidadeOperacional: {
          type: "object",
          required: ["nome_unidade", "id_grupamento_fk"],
          properties: {
            id_unidade: { type: "string", format: "uuid" },
            nome_unidade: {
              type: "string",
              example: "Quartel Central do Recife (QCG)",
            },
            endereco_base: { type: "string", nullable: true },
            id_grupamento_fk: { type: "string", format: "uuid" },
          },
        },
        Viatura: {
          type: "object",
          required: ["tipo_vt", "numero_viatura", "id_unidade_operacional_fk"],
          properties: {
            id_viatura: { type: "string", format: "uuid" },
            tipo_vt: { type: "string", example: "Auto Bomba Tanque" },
            numero_viatura: { type: "string", example: "ABT-01" },
            id_unidade_operacional_fk: { type: "string", format: "uuid" },
          },
        },
        Natureza: {
          type: "object",
          required: ["descricao"],
          properties: {
            id_natureza: { type: "string", format: "uuid" },
            descricao: { type: "string", example: "INCENDIO" },
          },
        },
        Grupo: {
          type: "object",
          required: ["descricao_grupo", "id_natureza_fk"],
          properties: {
            id_grupo: { type: "string", format: "uuid" },
            descricao_grupo: {
              type: "string",
              example: "Incêndio em Edificação",
            },
            id_natureza_fk: { type: "string", format: "uuid" },
          },
        },
        Subgrupo: {
          type: "object",
          required: ["descricao_subgrupo", "id_grupo_fk"],
          properties: {
            id_subgrupo: { type: "string", format: "uuid" },
            descricao_subgrupo: {
              type: "string",
              example: "Incêndio em Residência",
            },
            id_grupo_fk: { type: "string", format: "uuid" },
          },
        },
        FormaAcervo: {
          type: "object",
          required: ["descricao"],
          properties: {
            id_forma_acervo: { type: "string", format: "uuid" },
            descricao: { type: "string", example: "TELEFONE 193" },
          },
        },
        Municipio: {
          type: "object",
          required: ["nome_municipio"],
          properties: {
            id_municipio: { type: "string", format: "uuid" },
            nome_municipio: { type: "string", example: "Recife" },
          },
        },
        Bairro: {
          type: "object",
          required: ["nome_bairro"],
          properties: {
            id_bairro: { type: "string", format: "uuid" },
            nome_bairro: { type: "string", example: "Boa Viagem" },
            regiao: { type: "string", nullable: true },
            ais: { type: "string", nullable: true },
            id_municipio_fk: { type: "string", format: "uuid", nullable: true },
          },
        },
        SuccessDelete: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Recurso deletado com sucesso.",
            },
          },
        },
        Error400: {
          type: "array",
          items: {
            type: "object",
            properties: {
              path: { type: "array", items: { type: "string" } },
              message: { type: "string" },
            },
          },
          example: [
            { path: ["body", "email"], message: "O email é obrigatório" },
          ],
        },
        Error401: {
          type: "object",
          properties: {
            error: {
              type: "string",
              example: "Acesso negado: nenhum token fornecido.",
            },
          },
        },
        Error403: {
          type: "object",
          properties: {
            error: {
              type: "string",
              example: "Acesso negado: rota exclusiva para administradores.",
            },
          },
        },
        Error404: {
          type: "object",
          properties: {
            error: { type: "string", example: "Recurso não encontrado" },
          },
        },
        Error409: {
          type: "object",
          properties: {
            error: {
              type: "string",
              example: "Já existe um recurso com estes dados.",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./dist/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
