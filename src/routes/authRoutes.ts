import { Router } from 'express';
import * as authController from '../controllers/authController';
import { registerSchema, loginSchema } from '../validators/authValidator';
import { validate } from '../middleware/validate';

const router = Router();

/**
 * @swagger
 * tags:
 * name: Autenticação
 * description: Endpoints para registro e login de usuários
 */

/**
 * @swagger
 * /api/auth/register:
 * post:
 * summary: Registra um novo usuário
 * tags: [Autenticação]
 * security: []
 * description: Rota pública para registrar um novo usuário. Se a senha não for fornecida, uma temporária será gerada e enviada por e-mail.
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/UserInput'
 * responses:
 * '201':
 * description: Usuário criado com sucesso!
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message: { type: 'string' }
 * data: { $ref: '#/components/schemas/User' }
 * '400':
 * description: Dados inválidos
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Error400' }
 * '409':
 * description: E-mail ou matrícula já cadastrado
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Error409' }
 */
router.post('/register', validate(registerSchema), authController.register);

/**
 * @swagger
 * /api/auth/login:
 * post:
 * summary: Realiza login e obtém um token JWT
 * tags: [Autenticação]
 * security: []
 * description: Rota pública para autenticar e receber um token de acesso.
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required: [email, password]
 * properties:
 * email: { type: 'string', format: 'email' }
 * password: { type: 'string', format: 'password' }
 * responses:
 * '200':
 * description: Login bem-sucedido!
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message: { type: 'string' }
 * token: { type: 'string' }
 * user: { $ref: '#/components/schemas/User' }
 * '401':
 * description: Email ou senha inválidos
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Error401' }
 */
router.post('/login', validate(loginSchema), authController.login);

export default router;