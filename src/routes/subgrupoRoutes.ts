import { Router } from 'express';
import { create, getAll, remove } from '../controllers/subgrupoController';
import { authenticateAdmin, authenticateToken } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { subgrupoSchema } from '../validators/subgrupoValidator';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: "Admin: Subgrupos"
 *     description: (Admin) Endpoints para gerenciar os subgrupos.
 *
 * /api/v3/subgrupos:
 *   post:
 *     summary: Cria um novo subgrupo (apenas Admin)
 *     tags: ["Admin: Subgrupos"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subgrupo'
 *     responses:
 *       201:
 *         description: Subgrupo criado com sucesso.
 *       400:
 *         description: Erro de validação.
 *       403:
 *         description: Acesso negado (não é Admin).
 *       409:
 *         description: Conflito (subgrupo já existe).
 *
 *   get:
 *     summary: Lista todos os subgrupos
 *     tags: ["Admin: Subgrupos"]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de subgrupos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subgrupo'
 *       401:
 *         description: Não autorizado.
 *
 * /api/v3/subgrupos/{id}:
 *   delete:
 *     summary: Deleta um subgrupo pelo ID (apenas Admin)
 *     tags: ["Admin: Subgrupos"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do subgrupo
 *     responses:
 *       200:
 *         description: Subgrupo deletado com sucesso.
 *       403:
 *         description: Acesso negado (não é Admin).
 *       404:
 *         description: Subgrupo não encontrado.
 */

router.get('/', authenticateToken, getAll);
router.post('/', authenticateAdmin, validate(subgrupoSchema), create);
router.delete('/:id', authenticateAdmin, remove);

export default router;
