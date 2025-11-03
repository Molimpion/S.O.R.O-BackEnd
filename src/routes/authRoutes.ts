import { Router } from 'express';
import authController from '../controllers/authController';
import { validate } from '../middleware/validate';
import { loginSchema, registerSchema } from '../validators/authValidator';

const router = Router();

/**
 * @swagger
 * tags:
 * name: Autenticação
 * description: Endpoints para registro e login de usuários
 * /api/v1/auth/register:  <-- CORRIGIDO
 * post:
 * summary: Registra um novo usuário
 * tags: [Autenticação]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/UserInput'
 * responses:
 * 201:
 * description: Usuário registrado com sucesso.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/User'
 * 400:
 * description: Erro de validação.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error400'
 * /api/v1/auth/login:  <-- CORRIGIDO
 * post:
 * summary: Autentica um usuário e retorna um token JWT
 * tags: [Autenticação]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - email
 * - password
 * properties:
 * email:
 * type: string
 * format: email
 * password:
 * type: string
 * format: password
 * responses:
 * 200:
 * description: Login bem-sucedido.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * token:
 * type: string
 * description: Token JWT para acesso à API
 * user:
 * $ref: '#/components/schemas/User'
 * 401:
 * description: Credenciais inválidas.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error401'
 */
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);

export default router;
