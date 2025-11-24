import { Router } from 'express';
import { create, getAll, remove } from '../controllers/formaAcervoController';
import { authenticateAdmin } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { formaAcervoSchema } from '../validators/formaAcervoValidator';

const router = Router();

// ======================================================
// ==== ANOTAÇÕES SWAGGER (JSDoc) - FORMAS ACERVO ====
// ======================================================

/**
 * @swagger
 * tags:
 *   - name: "Admin: Formas de Acervo"
 *     description: (Admin) Endpoints para gerenciar as formas de acervo.
 * /api/v1/formas-acervo:
 *   post:
 *     summary: Cria uma nova forma de acervo (apenas Admin)
 *     tags: ["Admin: Formas de Acervo"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FormaAcervo'
 *     responses:
 *       201:
 *         description: Forma de acervo criada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FormaAcervo'
 *       400:
 *         description: Erro de validação.
 *       403:
 *         description: Acesso negado (não é Admin).
 *       409:
 *         description: Conflito (forma já existe).
 *   get:
 *     summary: Lista todas as formas de acervo
 *     tags: ["Admin: Formas de Acervo"]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de formas de acervo.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FormaAcervo'
 *       401:
 *         description: Não autorizado.
 * /api/v1/formas-acervo/{id}:
 *   delete:
 *     summary: Deleta uma forma de acervo pelo ID (apenas Admin)
 *     tags: ["Admin: Formas de Acervo"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da forma de acervo
 *     responses:
 *       200:
 *         description: Forma de acervo deletada com sucesso.
 *       403:
 *         description: Acesso negado (não é Admin).
 *       404:
 *         description: Forma de acervo não encontrada.
 */

router.use(authenticateAdmin);

router.post('/', validate(formaAcervoSchema), create);
router.get('/', getAll);
router.delete('/:id', remove);

export default router;
