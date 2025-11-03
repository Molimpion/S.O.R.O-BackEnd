import { Router } from 'express';
import { create, getAll, getById, update, remove } from '../controllers/municipioController';
import { authenticateAdmin } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { createMunicipioSchema, putMunicipioSchema } from '../validators/municipioValidator';

const router = Router();

// ======================================================
// ==== ANOTAÇÕES SWAGGER (JSDoc) - MUNICÍPIOS ====
// ======================================================

/**
 * @swagger
 * tags:
 *   - name: "Admin: Municípios"
 *     description: (Admin) Endpoints para gerenciar os municípios.
 * /api/v1/municipios:
 *   post:
 *     summary: Cria um novo município (apenas Admin)
 *     tags: ["Admin: Municípios"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Municipio'
 *     responses:
 *       201:
 *         description: Município criado com sucesso.
 *       400:
 *         description: Erro de validação.
 *       403:
 *         description: Acesso negado (não é Admin).
 *       409:
 *         description: Conflito (município já existe).
 *   get:
 *     summary: Lista todos os municípios
 *     tags: ["Admin: Municípios"]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de municípios.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Municipio'
 *       401:
 *         description: Não autorizado.
 * /api/v1/municipios/{id}:
 *   get:
 *     summary: Obtém um município pelo ID
 *     tags: ["Admin: Municípios"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do município
 *     responses:
 *       200:
 *         description: Detalhes do município.
 *       404:
 *         description: Município não encontrado.
 *   put:
 *     summary: Atualiza um município pelo ID (apenas Admin)
 *     tags: ["Admin: Municípios"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do município
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Municipio'
 *     responses:
 *       200:
 *         description: Município atualizado com sucesso.
 *       400:
 *         description: Erro de validação.
 *       403:
 *         description: Acesso negado (não é Admin).
 *       404:
 *         description: Município não encontrado.
 *   delete:
 *     summary: Deleta um município pelo ID (apenas Admin)
 *     tags: ["Admin: Municípios"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do município
 *     responses:
 *       200:
 *         description: Município deletado com sucesso.
 *       403:
 *         description: Acesso negado (não é Admin).
 *       404:
 *         description: Município não encontrado.
 */

router.use(authenticateAdmin);

router.post('/', validate(createMunicipioSchema), create);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', validate(putMunicipioSchema), update);
router.delete('/:id', remove);

export default router;
