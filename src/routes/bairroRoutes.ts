import { Router } from "express";
import {
  create,
  getAll,
  getById,
  update,
  remove,
} from "../controllers/bairroController";
import { authenticateAdmin } from "../middleware/authMiddleware";
import { validate } from "../middleware/validate";
import {
  createBairroSchema,
  putBairroSchema,
} from "../validators/bairroValidator";

const router = Router();

// ======================================================
// ==== ANOTAÇÕES SWAGGER (JSDoc) - BAIRROS ====
// ======================================================

/**
 * @swagger
 * tags:
 *   - name: "Admin: Bairros"
 *     description: (Admin) Endpoints para gerenciar os bairros.
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bairro'
 *       400:
 *         description: Erro de validação.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error400'
 *       403:
 *         description: Acesso negado (não é Admin).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error403'
 *       409:
 *         description: Conflito (bairro já existe).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error409'
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bairro'
 *       400:
 *         description: Erro de validação.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error400'
 *       403:
 *         description: Acesso negado (não é Admin).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error403'
 *       404:
 *         description: Bairro não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessDelete'
 *       403:
 *         description: Acesso negado (não é Admin).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error403'
 *       404:
 *         description: Bairro não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 */

router.use(authenticateAdmin);

router.post("/", validate(createBairroSchema), create);
router.get("/", getAll);
router.get("/:id", getById);
router.put("/:id", validate(putBairroSchema), update);
router.delete("/:id", remove);

export default router;
