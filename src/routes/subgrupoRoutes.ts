import { Router } from 'express';
import * as subgrupoController from '../controllers/subgrupoController';
import { authenticateToken, checkAdmin } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { subgrupoSchema } from '../validators/subgrupoValidator';

const router = Router();
router.use(authenticateToken, checkAdmin);

/**
 * @swagger
 * /api/subgrupos:
 *   post:
 *     summary: Cria um novo Subgrupo
 *     tags:
 *       - Admin: Classificação (Natureza, Grupo, Subgrupo)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subgrupo'
 *     responses:
 *       '201':
 *         description: Subgrupo criado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 data:
 *                   $ref: '#/components/schemas/Subgrupo'
 *       '404':
 *         description: Grupo (id_grupo_fk) não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 *   get:
 *     summary: Lista todos os Subgrupos
 *     tags:
 *       - Admin: Classificação (Natureza, Grupo, Subgrupo)
 *     responses:
 *       '200':
 *         description: Lista de subgrupos (com grupo e natureza aninhados)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subgrupo'
 */
router.post('/', validate(subgrupoSchema), subgrupoController.create);
router.get('/', subgrupoController.getAll);

/**
 * @swagger
 * /api/subgrupos/{id}:
 *   delete:
 *     summary: Deleta um Subgrupo
 *     tags:
 *       - Admin: Classificação (Natureza, Grupo, Subgrupo)
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string, format: uuid }
 *         required: true
 *         description: ID do subgrupo
 *     responses:
 *       '200':
 *         description: Subgrupo deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessDelete'
 *       '404':
 *         description: Subgrupo não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 *       '409':
 *         description: Conflito (subgrupo está associado a ocorrências)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error409'
 */
router.delete('/:id', subgrupoController.remove);

export default router;
