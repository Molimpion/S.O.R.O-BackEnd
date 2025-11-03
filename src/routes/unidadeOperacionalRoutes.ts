import { Router } from 'express';
import { create, getAll, remove } from '../controllers/unidadeOperacionalController'; // CORRIGIDO: Importação nomeada
import { authenticateAdmin } from '../middleware/authMiddleware'; 
import { validate } from '../middleware/validate';
import { unidadeSchema } from '../validators/unidadeOperacionalValidator'; // CORRIGIDO: Nome do schema

const router = Router();

// ======================================================
// ==== ANOTAÇÕES SWAGGER (JSDoc) - UNIDADES OPERACIONAIS ====
// ======================================================

/**
 * @swagger
 * tags:
 *   - name: Admin: Unidades Operacionais
 *     description: (Admin) Endpoints para gerenciar as unidades operacionais.
 *
 * /api/v1/unidades-operacionais:
 *   post:
 *     summary: Cria uma nova unidade operacional (apenas Admin)
 *     tags: [Admin: Unidades Operacionais]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UnidadeOperacional'
 *     responses:
 *       201:
 *         description: Unidade operacional criada com sucesso.
 *       400:
 *         description: Erro de validação.
 *       403:
 *         description: Acesso negado (não é Admin).
 *       409:
 *         description: Conflito (unidade já existe).
 *
 *   get:
 *     summary: Lista todas as unidades operacionais
 *     tags: [Admin: Unidades Operacionais]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de unidades operacionais.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UnidadeOperacional'
 *       401:
 *         description: Não autorizado.
 *
 * /api/v1/unidades-operacionais/{id}:
 *   delete:
 *     summary: Deleta uma unidade operacional pelo ID (apenas Admin)
 *     tags: [Admin: Unidades Operacionais]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da unidade operacional
 *     responses:
 *       200:
 *         description: Unidade operacional deletada com sucesso.
 *       403:
 *         description: Acesso negado (não é Admin).
 *       404:
 *         description: Unidade operacional não encontrada.
 */

router.use(authenticateAdmin);

router.post('/', validate(unidadeSchema), create);
router.get('/', getAll);
router.delete('/:id', remove);

export default router;
