import { Router } from 'express';
import * as ocorrenciaController from '../controllers/ocorrenciaController';
import { authenticateToken } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import {
  createOcorrenciaSchema,
  listOcorrenciaSchema,
  putOcorrenciaSchema,
  patchOcorrenciaSchema,
} from '../validators/ocorrenciaValidator';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

/**
 * @swagger
 * /api/ocorrencias:
 *   post:
 *     summary: Cria uma nova ocorrência
 *     tags: [Ocorrências]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OcorrenciaInput'
 *     responses:
 *       '201':
 *         description: Ocorrência criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Ocorrencia'
 *       '400':
 *         $ref: '#/components/schemas/Error400'
 *       '404':
 *         $ref: '#/components/schemas/Error404'
 *   get:
 *     summary: Lista ocorrências com filtros e paginação
 *     tags: [Ocorrências]
 *     parameters:
 *       - in: query
 *         name: dataInicio
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: dataFim
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDENTE, EM_ANDAMENTO, CONCLUIDO, CANCELADO]
 *       - in: query
 *         name: bairroId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: subgrupoId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       '200':
 *         description: Lista paginada de ocorrências
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Ocorrencia'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 */
router.post('/', validate(createOcorrenciaSchema), ocorrenciaController.create);
router.get('/', validate(listOcorrenciaSchema), ocorrenciaController.getAll);

/**
 * @swagger
 * /api/ocorrencias/{id}:
 *   get:
 *     summary: Obtém detalhes de uma ocorrência
 *     tags: [Ocorrências]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da ocorrência
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '200':
 *         $ref: '#/components/schemas/Ocorrencia'
 *       '404':
 *         $ref: '#/components/schemas/Error404'
 *   put:
 *     summary: Substitui os dados de uma ocorrência (PUT)
 *     tags: [Ocorrências]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da ocorrência
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OcorrenciaInput'
 *     responses:
 *       '200':
 *         $ref: '#/components/schemas/Ocorrencia'
 *       '400':
 *         $ref: '#/components/schemas/Error400'
 *       '403':
 *         $ref: '#/components/schemas/Error403'
 *       '404':
 *         $ref: '#/components/schemas/Error404'
 *   patch:
 *     summary: Atualiza parcialmente uma ocorrência (PATCH)
 *     tags: [Ocorrências]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da ocorrência
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OcorrenciaPatchInput'
 *     responses:
 *       '200':
 *         $ref: '#/components/schemas/Ocorrencia'
 *       '400':
 *         $ref: '#/components/schemas/Error400'
 *       '403':
 *         $ref: '#/components/schemas/Error403'
 *       '404':
 *         $ref: '#/components/schemas/Error404'
 */
router.get('/:id', ocorrenciaController.getById);
router.put('/:id', validate(putOcorrenciaSchema), ocorrenciaController.update);
router.patch('/:id', validate(patchOcorrenciaSchema), ocorrenciaController.update);

export default router;
