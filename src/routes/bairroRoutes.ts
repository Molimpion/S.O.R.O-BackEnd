import { Router } from 'express';
import { create, getAll, getById, update, remove } from '../controllers/bairroController';
import { authenticateAdmin, authenticateToken } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { createBairroSchema, putBairroSchema } from '../validators/bairroValidator';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: "Admin: Bairros"
 *     description: (Admin) Endpoints para gerenciar os bairros.
 *
 * /api/v1/bairros:
 *   post:
 *     summary: Cria um novo bairro (apenas Admin)
 *     tags: ["Admin: Bairros"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Bairro'
 *     responses:
 *       201:
 *         description: Bairro criado com sucesso.
 *       400:
 *         description: Erro de validação.
 *       403:
 *         description: Acesso negado (não é Admin).
 *       409:
 *         description: Conflito (bairro já existe).
 *
 *   get:
 *     summary: Lista todos os bairros
 *     tags: ["Admin: Bairros"]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de bairros.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bairro'
 *       401:
 *         description: Não autorizado.
 *
 * /api/v1/bairros/{id}:
 *   get:
 *     summary: Obtém um bairro pelo ID
 *     tags: ["Admin: Bairros"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do bairro
 *     responses:
 *       200:
 *         description: Detalhes do bairro.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bairro'
 *       404:
 *         description: Bairro não encontrado.
 *
 *   put:
 *     summary: Atualiza um bairro pelo ID (apenas Admin)
 *     tags: ["Admin: Bairros"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do bairro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Bairro'
 *     responses:
 *       200:
 *         description: Bairro atualizado com sucesso.
 *       400:
 *         description: Erro de validação.
 *       403:
 *         description: Acesso negado (não é Admin).
 *       404:
 *         description: Bairro não encontrado.
 *
 *   delete:
 *     summary: Deleta um bairro pelo ID (apenas Admin)
 *     tags: ["Admin: Bairros"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do bairro
 *     responses:
 *       200:
 *         description: Bairro deletado com sucesso.
 *       403:
 *         description: Acesso negado (não é Admin).
 *       404:
 *         description: Bairro não encontrado.
 */

router.get('/', authenticateToken, getAll);
router.get('/:id', authenticateToken, getById);
router.post('/', authenticateAdmin, validate(createBairroSchema), create);
router.put('/:id', authenticateAdmin, validate(putBairroSchema), update);
router.delete('/:id', authenticateAdmin, remove);

export default router;