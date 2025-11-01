import { Router } from 'express';
import * as grupoController from '../controllers/grupoController';
import { authenticateToken, checkAdmin } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { grupoSchema } from '../validators/grupoValidator';

const router = Router();
router.use(authenticateToken, checkAdmin);

/**
 * @swagger
 * /api/grupos:
 *   post:
 *     summary: Cria um novo Grupo
 *     tags:
 *       - Admin: Classificação (Natureza, Grupo, Subgrupo)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Grupo'
 *     responses:
 *       '201':
 *         description: Grupo criado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 data:
 *                   $ref: '#/components/schemas/Grupo'
 *       '404':
 *         description: Natureza (id_natureza_fk) não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 *   get:
 *     summary: Lista todos os Grupos
 *     tags:
 *       - Admin: Classificação (Natureza, Grupo, Subgrupo)
 *     responses:
 *       '200':
 *         description: Lista de grupos (com natureza aninhada)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Grupo'
 */
router.post('/', validate(grupoSchema), grupoController.create);
router.get('/', grupoController.getAll);

/**
 * @swagger
 * /api/grupos/{id}:
 *   delete:
 *     summary: Deleta um Grupo
 *     tags:
 *       - Admin: Classificação (Natureza, Grupo, Subgrupo)
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string, format: uuid }
 *         required: true
 *         description: ID do grupo
 *     responses:
 *       '200':
 *         description: Grupo deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessDelete'
 *       '404':
 *         description: Grupo não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 *       '409':
 *         description: Conflito (grupo está associado a subgrupos)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error409'
 */
router.delete('/:id', grupoController.remove);

export default router;