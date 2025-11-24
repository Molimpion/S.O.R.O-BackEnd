import { Router } from 'express';
import { register, login } from '../controllers/authController'; // Importação nomeada correta
import { registerSchema, loginSchema } from '../validators/authValidator';
import { validate } from '../middleware/validate';

const router = Router();

// ======================================================
// ==== ANOTAÇÕES SWAGGER (JSDoc) - AUTENTICAÇÃO ====
// ======================================================

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Autenticação de Usuários
 *
 * /api/v1/auth/register:
 *   post:
 *     summary: Registra um novo usuário (Admin)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRegister'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthToken'
 *       400:
 *         description: Erro de validação.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error400'
 *       409:
 *         description: Conflito (Usuário já existe).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error409'
 *
 * /api/v1/auth/login:
 *   post:
 *     summary: Login de usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthLogin'
 *     responses:
 *       200:
 *         description: Login bem-sucedido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthToken'
 *       401:
 *         description: Credenciais inválidas.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 */

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

export default router;
