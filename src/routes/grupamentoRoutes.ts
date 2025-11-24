import { Router } from 'express';
import { create, getAll, remove } from '../controllers/grupamentoController';
import { authenticateAdmin } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { grupamentoSchema } from '../validators/grupamentoValidator';

const router = Router();

// ======================================================
// ==== ANOTAÇÕES SWAGGER (JSDoc) - GRUPAMENTOS ====
// ======================================================

/**
 * @swagger
 * tags:
 *   - name: "Admin: Grupamentos"
 *     description: (Admin) Endpoints para gerenciar os grupamentos.
 * /api/v1/grupamentos:
 *   post:
 *     summary: Cria um novo grupamento (apenas Admin)
 *     tags: ["Admin: Grupamentos"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Grupamento'
 *     responses:
 *       201:
 *         description: Grupamento criado com sucesso.
 *       400:
 *         description: Erro de validação.
 *       403:
 *         description: Acesso negado (não é Admin).
 *       409:
 *         description: Conflito (grupamento já existe).
 *   get:
 *     summary: Lista todos os grupamentos
 *     tags: ["Admin: Grupamentos"]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de grupamentos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Grupamento'
 *       401:
 *         description: Não autorizado.
 * /api/v1/grupamentos/{id}:
 *   delete:
 *     summary: Deleta um grupamento pelo ID (apenas Admin)
 *     tags: ["Admin: Grupamentos"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do grupamento
 *     responses:
 *       200:
 *         description: Grupamento deletado com sucesso.
 *       403:
 *         description: Acesso negado (não é Admin).
 *       404:
 *         description: Grupamento não encontrado.
 */

router.use(authenticateAdmin);

router.post('/', validate(grupamentoSchema), create);
router.get('/', getAll);
router.delete('/:id', remove);

export default router;
