import { Router } from 'express';
import { create, getAll, remove, update } from '../controllers/viaturaController';
import { authenticateAdmin, authenticateToken } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { createViaturaSchema, patchViaturaSchema, putViaturaSchema } from '../validators/viaturaValidator';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: "Admin: Viaturas"
 *     description: (Admin) Endpoints para gerenciar as viaturas.
 *
 * /api/v3/viaturas:
 *   post:
 *     summary: Cria uma nova viatura (apenas Admin)
 *     tags: ["Admin: Viaturas"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Viatura'
 *     responses:
 *       201:
 *         description: Viatura criada com sucesso.
 *       400:
 *         description: Erro de validação.
 *       403:
 *         description: Acesso negado (não é Admin).
 *       409:
 *         description: Conflito (viatura já existe).
 *
 *   get:
 *     summary: Lista todas as viaturas
 *     tags: ["Admin: Viaturas"]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de viaturas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Viatura'
 *       401:
 *         description: Não autorizado.
 *
 * /api/v3/viaturas/{id}:
 *   delete:
 *     summary: Deleta uma viatura pelo ID (apenas Admin)
 *     tags: ["Admin: Viaturas"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da viatura
 *     responses:
 *       200:
 *         description: Viatura deletada com sucesso.
 *       403:
 *         description: Acesso negado (não é Admin).
 *       404:
 *         description: Viatura não encontrada.
 */

router.get('/', authenticateToken, getAll);
router.post('/', authenticateAdmin, validate(createViaturaSchema), create);
router.put('/:id', authenticateAdmin, validate(putViaturaSchema), update);
router.patch('/:id', authenticateAdmin, validate(patchViaturaSchema), update);
router.delete('/:id', authenticateAdmin, remove);

export default router;
