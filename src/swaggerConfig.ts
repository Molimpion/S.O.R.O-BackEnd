import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API S.O.R.O - Bombeiros',
      version: '1.0.0',
      description: 'Documentação da API S.O.R.O. para gerenciamento de ocorrências, usuários, viaturas e recursos.',
      contact: {
        name: 'Equipe Backend S.O.R.O.',
        email: 'desenvolvimento@bombeiros.pe.gov.br'
      }
    },
    servers: [
      {
        url: 'https://api-bombeiros-s-o-r-o.onrender.com',
        description: 'Servidor de Produção (Render)'
      },
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desenvolvimento Local'
      }
    ],
    // 1. COMPONENTES (SCHEMAS) CENTRALIZADOS
    components: {
      // Schemas de Segurança
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtido no login (Ex: Bearer eyJhbGci...)'
        }
      },
      // Schemas de Dados (Modelos da API)
      schemas: {
        
        // --- Entidades Principais ---
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            nome: { type: 'string' },
            email: { type: 'string', format: 'email' },
            matricula: { type: 'string' },
            tipo_perfil: { type: 'string', enum: ['ADMIN', 'ANALISTA', 'CHEFE'] },
            nome_guerra: { type: 'string', nullable: true },
            posto_grad: { type: 'string', nullable: true },
            id_unidade_operacional_fk: { type: 'string', format: 'uuid', nullable: true }
          }
        },
        UserInput: {
          type: 'object',
          required: ['nome', 'email', 'matricula', 'tipo_perfil'],
          properties: {
            nome: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', format: 'password', description: 'Opcional no registro (será gerada e enviada por email). Obrigatória no login.' },
            matricula: { type: 'string' },
            tipo_perfil: { type: 'string', enum: ['ADMIN', 'ANALISTA', 'CHEFE'] },
            nome_guerra: { type: 'string', nullable: true },
            posto_grad: { type: 'string', nullable: true },
            id_unidade_operacional_fk: { type: 'string', format: 'uuid', nullable: true }
          }
        },
        Ocorrencia: {
          type: 'object',
          properties: {
            id_ocorrencia: { type: 'string', format: 'uuid' },
            nr_aviso: { type: 'string', nullable: true },
            data_acionamento: { type: 'string', format: 'date-time' },
            hora_acionamento: { type: 'string', format: 'date-time' },
            status_situacao: { type: 'string', enum: ['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO'] },
            data_execucao_servico: { type: 'string', format: 'date-time', nullable: true },
            relacionado_eleicao: { type: 'boolean' },
            id_subgrupo_fk: { type: 'string', format: 'uuid' },
            id_bairro_fk: { type: 'string', format: 'uuid' },
            id_forma_acervo_fk: { type: 'string', format: 'uuid' },
            id_usuario_abertura_fk: { type: 'string', format: 'uuid' }
          }
        },
        OcorrenciaInput: {
          type: 'object',
          required: ['data_acionamento', 'hora_acionamento', 'id_subgrupo_fk', 'id_bairro_fk', 'id_forma_acervo_fk'],
          properties: {
            data_acionamento: { type: 'string', format: 'date-time' },
            hora_acionamento: { type: 'string', format: 'date-time' },
            id_subgrupo_fk: { type: 'string', format: 'uuid' },
            id_bairro_fk: { type: 'string', format: 'uuid' },
            id_forma_acervo_fk: { type: 'string', format: 'uuid' },
            nr_aviso: { type: 'string', nullable: true }
          }
        },

        // --- Entidades de Organização ---
        Grupamento: {
          type: 'object',
          required: ['nome_grupamento', 'sigla'],
          properties: {
            id_grupamento: { type: 'string', format: 'uuid' },
            nome_grupamento: { type: 'string', example: 'Grupamento de Bombeiros Metropolitano' },
            sigla: { type: 'string', example: 'GBM' }
          }
        },
        UnidadeOperacional: {
          type: 'object',
          required: ['nome_unidade', 'id_grupamento_fk'],
          properties: {
            id_unidade: { type: 'string', format: 'uuid' },
            nome_unidade: { type: 'string', example: 'Quartel Central do Recife (QCG)' },
            endereco_base: { type: 'string', nullable: true },
            id_grupamento_fk: { type: 'string', format: 'uuid' }
          }
        },
        Viatura: {
          type: 'object',
          required: ['tipo_vt', 'numero_viatura', 'id_unidade_operacional_fk'],
          properties: {
            id_viatura: { type: 'string', format: 'uuid' },
            tipo_vt: { type: 'string', example: 'Auto Bomba Tanque' },
            numero_viatura: { type: 'string', example: 'ABT-01' },
            id_unidade_operacional_fk: { type: 'string', format: 'uuid' }
          }
        },

        // --- Entidades de Classificação (Lookup) ---
        Natureza: {
          type: 'object',
          required: ['descricao'],
          properties: {
            id_natureza: { type: 'string', format: 'uuid' },
            descricao: { type: 'string', example: 'INCENDIO' }
          }
        },
        Grupo: {
          type: 'object',
          required: ['descricao_grupo', 'id_natureza_fk'],
          properties: {
            id_grupo: { type: 'string', format: 'uuid' },
            descricao_grupo: { type: 'string', example: 'Incêndio em Edificação' },
            id_natureza_fk: { type: 'string', format: 'uuid' }
          }
        },
        Subgrupo: {
          type: 'object',
          required: ['descricao_subgrupo', 'id_grupo_fk'],
          properties: {
            id_subgrupo: { type: 'string', format: 'uuid' },
            descricao_subgrupo: { type: 'string', example: 'Incêndio em Residência' },
            id_grupo_fk: { type: 'string', format: 'uuid' }
          }
        },
        FormaAcervo: {
          type: 'object',
          required: ['descricao'],
          properties: {
            id_forma_acervo: { type: 'string', format: 'uuid' },
            descricao: { type: 'string', example: 'TELEFONE 193' }
          }
        },
        Municipio: {
          type: 'object',
          required: ['nome_municipio'],
          properties: {
            id_municipio: { type: 'string', format: 'uuid' },
            nome_municipio: { type: 'string', example: 'Recife' }
          }
        },
        Bairro: {
          type: 'object',
          required: ['nome_bairro'],
          properties: {
            id_bairro: { type: 'string', format: 'uuid' },
            nome_bairro: { type: 'string', example: 'Boa Viagem' },
            regiao: { type: 'string', nullable: true },
            ais: { type: 'string', nullable: true },
            id_municipio_fk: { type: 'string', format: 'uuid', nullable: true }
          }
        },

        // --- Respostas Padrão ---
        SuccessDelete: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Recurso deletado com sucesso.' }
          }
        },
        
        // --- Erros Padrão ---
        Error400: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              path: { type: 'array', items: { type: 'string' } },
              message: { type: 'string' }
            }
          },
          example: [
            { path: ['body', 'email'], message: 'O email é obrigatório' }
          ]
        },
        Error401: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Acesso negado: nenhum token fornecido.' }
          }
        },
        Error403: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Acesso negado: rota exclusiva para administradores.' }
          }
        },
        Error404: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Recurso não encontrado' }
          }
        },
        Error409: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Já existe um recurso com estes dados.' }
          }
        }
      }
    },
    // 2. SEGURANÇA GLOBAL (Aplica Bearer Auth em todas as rotas por padrão)
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  // Caminho para os arquivos que contêm as anotações JSDoc
  apis: ['./src/routes/*.ts'], 
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;