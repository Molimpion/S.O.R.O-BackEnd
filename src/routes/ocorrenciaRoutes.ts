// src/routes/ocorrenciaRoutes.ts 

import { Router } from 'express';
import { create, getAll, getById, update } from '../controllers/ocorrenciaController'; // CORRIGIDO: Importação nomeada
import { authenticateToken, checkAdmin } from '../middleware/authMiddleware'; 
import { validate } from '../middleware/validate';
import { 
  createOcorrenciaSchema, 
  listOcorrenciaSchema,
  putOcorrenciaSchema // CORRIGIDO
} from '../validators/ocorrenciaValidator'; 

const router = Router();

// ======================================================
// ==== ANOTAÇÕES SWAGGER (JSDoc) - OCORRÊNCIAS ====
// ======================================================

/**
 * @swagger
 * tags:
 * name: Ocorrências
 * description: Endpoints para gerenciar as ocorrências.
 * /api/v1/ocorrencias: 
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
 * $ref: '#/components/schemas/OcorrenciaCreate'
 * responses:
 * 201:
 * description: Ocorrência criada com sucesso.
 * 400:
 * description: Erro de validação.
 * 401:
 * description: Não autorizado.
 * get:
 * summary: Lista todas as ocorrências com filtros opcionais
 * tags: [Ocorrências]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: query
 * name: status
 * schema:
 * type: string
 * enum: [EM_ANDAMENTO, FINALIZADA, CANCELADA]
 * description: Filtrar por status (opcional)
 * - in: query
 * name: unidadeOperacionalId
 * schema:
 * type: string
 * format: uuid
 * description: Filtrar por Unidade Operacional (opcional)
 * - in: query
 * name: skip
 * schema:
 * type: integer
 * description: Número de itens para pular (opcional)
 * - in: query
 * name: take
 * schema:
 * type: integer
 * description: Número máximo de itens a retornar (opcional)
 * responses:
 * 200:
 * description: Lista de ocorrências.
 * 401:
 * description: Não autorizado.
 * /api/v1/ocorrencias/{id}: 
 * get:
 * summary: Obtém uma ocorrência pelo ID
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
 * 404:
 * description: Ocorrência não encontrada.
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
 * $ref: '#/components/schemas/OcorrenciaUpdate'
 * responses:
 * 200:
 * description: Ocorrência atualizada com sucesso.
 * 400:
 * description: Erro de validação.
 * 404:
 * description: Ocorrência não encontrada.
 */

router.use(authenticateToken);

router.get('/', validate(listOcorrenciaSchema), getAll);
router.get('/:id', getById);
router.post(
  '/',
  validate(createOcorrenciaSchema),
  create
);
router.put(
  '/:id',
  validate(putOcorrenciaSchema), // CORRIGIDO
  update
);
// Adicione a rota DELETE se necessário:
// router.delete('/:id', [authenticateToken, checkAdmin], remove); 

export default router;
