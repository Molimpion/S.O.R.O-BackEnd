import { Router } from 'express';
import { create, getAll, remove } from '../controllers/naturezaController';
import { authenticateAdmin, authenticateToken } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { naturezaSchema } from '../validators/naturezaValidator';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: "Admin: Naturezas"
 *     description: (Admin) Endpoints para gerenciar as naturezas de ocorrência.
 *
 * /api/v3/naturezas:
 *   post:
 *     summary: Cria uma nova natureza (apenas Admin)
 *     tags: ["Admin: Naturezas"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Natureza'
 *     responses:
 *       201:
 *         description: Natureza criada com sucesso.
 *       400:
 *         description: Erro de validação.
 *       403:
 *         description: Acesso negado (não é Admin).
 *       409:
 *         description: Conflito (natureza já existe).
 *
 *   get:
 *     summary: Lista todas as naturezas
 *     tags: ["Admin: Naturezas"]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de naturezas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Natureza'
 *       401:
 *         description: Não autorizado.
 *
 * /api/v3/naturezas/{id}:
 *   delete:
 *     summary: Deleta uma natureza pelo ID (apenas Admin)
 *     tags: ["Admin: Naturezas"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da natureza
 *     responses:
 *       200:
 *         description: Natureza deletada com sucesso.
 *       403:
 *         description: Acesso negado (não é Admin).
 *       404:
 *         description: Natureza não encontrada.
 */

router.get('/', authenticateToken, getAll);
router.post('/', authenticateAdmin, validate(naturezaSchema), create);
router.delete('/:id', authenticateAdmin, remove);

export default router;
