import { Router } from 'express';
import ocorrenciaController from '../controllers/ocorrenciaController';
import { validate } from '../middleware/validate';
import { createOcorrenciaSchema, updateOcorrenciaSchema } from '../validators/ocorrenciaValidator';
import { authenticateAdmin } from '../middleware/authMiddleware';

const router = Router();

// ======================================================
// ==== ANOTAÇÕES SWAGGER (JSDoc) - OCORRÊNCIAS ====
// ======================================================

/**
 * @swagger
 * tags:
 * name: Ocorrências
 * description: Endpoints para gerenciamento de ocorrências (acessível por Analistas e Admins).
 * /api/v1/ocorrencias:  <-- CORRIGIDO
 * post:
 * summary: Cria uma nova ocorrência
 * tags: [Ocorrências]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/OcorrenciaInput'
 * responses:
 * 201:
 * description: Ocorrência criada com sucesso.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Ocorrencia'
 * 400:
 * description: Erro de validação.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error400'
 * 401:
 * description: Não autorizado.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error401'
 * get:
 * summary: Lista ocorrências com filtros e paginação
 * tags: [Ocorrências]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: query
 * name: status_situacao
 * schema:
 * type: string
 * enum: [PENDENTE, EM_ANDAMENTO, CONCLUIDO, CANCELADO]
 * description: Filtra por status da ocorrência
 * - in: query
 * name: id_subgrupo_fk
 * schema:
 * type: string
 * format: uuid
 * description: Filtra por Subgrupo de Ocorrência
 * - in: query
 * name: search
 * schema:
 * type: string
 * description: Busca por Nr. Aviso
 * - in: query
 * name: page
 * schema:
 * type: integer
 * default: 1
 * description: Número da página
 * - in: query
 * name: pageSize
 * schema:
 * type: integer
 * default: 10
 * description: Tamanho da página
 * responses:
 * 200:
 * description: Lista de ocorrências.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Ocorrencia'
 * 401:
 * description: Não autorizado.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error401'
 * /api/v1/ocorrencias/{id}:  <-- CORRIGIDO
 * get:
 * summary: Obtém detalhes de uma ocorrência pelo ID
 * tags: [Ocorrências]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * format: uuid
 * description: ID da ocorrência
 * responses:
 * 200:
 * description: Detalhes da ocorrência.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Ocorrencia'
 * 401:
 * description: Não autorizado.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error401'
 * 404:
 * description: Ocorrência não encontrada.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error404'
 * put:
 * summary: Atualiza uma ocorrência pelo ID
 * tags: [Ocorrências]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * format: uuid
 * description: ID da ocorrência
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/OcorrenciaInput'
 * responses:
 * 200:
 * description: Ocorrência atualizada com sucesso.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Ocorrencia'
 * 400:
 * description: Erro de validação.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error400'
 * 401:
 * description: Não autorizado.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error401'
 * 403:
 * description: Acesso negado (não é Admin ou criador).
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error403'
 * 404:
 * description: Ocorrência não encontrada.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error404'
 * delete:
 * summary: Deleta uma ocorrência pelo ID (apenas Admin)
 * tags: [Ocorrências]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * format: uuid
 * description: ID da ocorrência
 * responses:
 * 200:
 * description: Ocorrência deletada com sucesso.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/SuccessDelete'
 * 401:
 * description: Não autorizado.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error401'
 * 403:
 * description: Acesso negado (não é Admin).
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error403'
 * 404:
 * description: Ocorrência não encontrada.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error404'
 */

router.post('/', validate(createOcorrenciaSchema), ocorrenciaController.create);
router.get('/', ocorrenciaController.list);
router.get('/:id', ocorrenciaController.get);
router.put('/:id', validate(updateOcorrenciaSchema), ocorrenciaController.update);

// Rotas exclusivas de Admin
router.delete('/:id', authenticateAdmin, ocorrenciaController.remove);

export default router;
