import { Router } from 'express';
import { create, getAll, remove } from '../controllers/grupoController';
import { authenticateAdmin } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { grupoSchema } from '../validators/grupoValidator';

const router = Router();

// ======================================================
// ==== ANOTAÇÕES SWAGGER (JSDoc) - GRUPOS ====
// ======================================================

/**
 * @swagger
 * tags:
 *   - name: "Admin: Grupos"
 *     description: (Admin) Endpoints para gerenciar os grupos.
 * /api/v1/grupos:
 *   post:
 *     summary: Cria um novo grupo (apenas Admin)
 *     tags: ["Admin: Grupos"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Grupo'
 *     responses:
 *       201:
 *         description: Grupo criado com sucesso.
 *       400:
 *         description: Erro de validação.
 *       403:
 *         description: Acesso negado (não é Admin).
 *       409:
 *         description: Conflito (grupo já existe).
 *   get:
 *     summary: Lista todos os grupos
 *     tags: ["Admin: Grupos"]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de grupos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Grupo'
 *       401:
 *         description: Não autorizado.
 * /api/v1/grupos/{id}:
 *   delete:
 *     summary: Deleta um grupo pelo ID (apenas Admin)
 *     tags: ["Admin: Grupos"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do grupo
 *     responses:
 *       200:
 *         description: Grupo deletado com sucesso.
 *       403:
 *         description: Acesso negado (não é Admin).
 *       404*
