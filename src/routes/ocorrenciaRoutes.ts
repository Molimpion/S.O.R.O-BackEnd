// src/routes/ocorrenciaRoutes.ts (COM AS DUAS ROTAS PUT/PATCH)

import { Router } from 'express';
import * as ocorrenciaController from '../controllers/ocorrenciaController';
import { authenticateToken } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';

// --- ALTERAÇÃO 1: Importar o novo schema ---
import { 
  createOcorrenciaSchema, 
  listOcorrenciaSchema,
  putOcorrenciaSchema,
  patchOcorrenciaSchema 
} from '../validators/ocorrenciaValidator'; 

const router = Router();
router.use(authenticateToken); // Requer autenticação para todas as rotas neste arquivo.

/**
 * @swagger
 * /api/ocorrencias:
 * post:
 * summary: Cria uma nova ocorrência
 * tags: [Ocorrências]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/OcorrenciaInput' }
 * responses:
 * '201':
 * description: Ocorrência criada com sucesso
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message: { type: 'string' }
 * data: { $ref: '#/components/schemas/Ocorrencia' }
 * '400':
 * description: Dados inválidos
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Error400' }
 * '404':
 * description: Recurso relacionado (bairro, subgrupo, etc) não encontrado
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Error404' }
 */
router.post(
  '/',
  validate(createOcorrenciaSchema),
  ocorrenciaController.create
);

/**
 * @swagger
 * /api/ocorrencias:
 * get:
 * summary: Lista ocorrências com filtros e paginação
 * tags: [Ocorrências]
 * parameters:
 * - in: query
 * name: dataInicio
 * schema: { type: 'string', format: 'date-time' }
 * - in: query
 * name: dataFim
 * schema: { type: 'string', format: 'date-time' }
 * - in: query
 * name: status
 * schema: { type: 'string', enum: ['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO'] }
 * - in: query
 * name: bairroId
 * schema: { type: 'string', format: 'uuid' }
 * - in: query
 * name: subgrupoId
 * schema: { type: 'string', format: 'uuid' }
 * - in: query
 * name: page
 * schema: { type: 'integer', default: 1 }
 * - in: query
 * name: limit
 * schema: { type: 'integer', default: 10 }
 * responses:
 * '200':
 * description: Lista paginada de ocorrências
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * data: { type: 'array', items: { $ref: '#/components/schemas/Ocorrencia' } }
 * total: { type: 'integer' }
 * page: { type: 'integer' }
 * totalPages: { type: 'integer' }
 */
router.get('/', validate(listOcorrenciaSchema), ocorrenciaController.getAll);

/**
 * @swagger
 * /api/ocorrencias/{id}:
 * get:
 * summary: Obtém detalhes de uma ocorrência
 * tags: [Ocorrências]
 * parameters:
 * - in: path
 * name: id
 * schema: { type: 'string', format: 'uuid' }
 * required: true
 * description: ID da ocorrência
 * responses:
 * '200':
 * description: Detalhes da ocorrência (incluindo relações)
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Ocorrencia' }
 * '404':
 * description: Ocorrência não encontrada
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Error404' }
 */
router.get('/:id', ocorrenciaController.getById);

/**
 * @swagger
 * /api/ocorrencias/{id}:
 * put:
 * summary: (PUT) Substitui os dados de uma ocorrência
 * tags: [Ocorrências]
 * parameters:
 * - in: path
 * name: id
 * schema: { type: 'string', format: 'uuid' }
 * required: true
 * description: ID da ocorrência
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * status_situacao: { type: 'string', enum: ['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO'] }
 * data_execucao_servico: { type: 'string', format: 'date-time', nullable: true }
 * relacionado_eleicao: { type: 'boolean' }
 * nr_aviso: { type: 'string', nullable: true }
 * responses:
 * '200':
 * description: Ocorrência atualizada
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message: { type: 'string' }
 * data: { $ref: '#/components/schemas/Ocorrencia' }
 * '400':
 * description: Dados inválidos (requer todos os campos)
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Error400' }
 * '403':
 * description: Acesso negado (usuário não é o dono da ocorrência)
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Error403' }
 * '404':
 * description: Ocorrência não encontrada
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Error404' }
 */
router.put(
  '/:id', 
  validate(putOcorrenciaSchema), 
  ocorrenciaController.update       
);

/**
 * @swagger
 * /api/ocorrencias/{id}:
 * patch:
 * summary: (PATCH) Atualiza parcialmente uma ocorrência
 * tags: [Ocorrências]
 * parameters:
 * - in: path
 * name: id
 * schema: { type: 'string', format: 'uuid' }
 * required: true
 * description: ID da ocorrência
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * status_situacao: { type: 'string', enum: ['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO'] }
 * data_execucao_servico: { type: 'string', format: 'date-time', nullable: true }
 * relacionado_eleicao: { type: 'boolean' }
 * nr_aviso: { type: 'string', nullable: true }
 * responses:
 * '200':
 * description: Ocorrência atualizada
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message: { type: 'string' }
 * data: { $ref: '#/components/schemas/Ocorrencia' }
 * '400':
 * description: Dados inválidos (campos opcionais)
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Error400' }
 * '403':
 * description: Acesso negado (usuário não é o dono da ocorrência)
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Error403' }
 * '404':
 * description: Ocorrência não encontrada
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Error404' }
 */
router.patch(
  '/:id', 
  validate(patchOcorrenciaSchema), 
  ocorrenciaController.update       
);

export default router;