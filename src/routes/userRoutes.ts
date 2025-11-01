import { Router } from 'express';
import { authenticateToken, checkAdmin } from '../middleware/authMiddleware';
import * as userController from '../controllers/userController';
import { validate } from '../middleware/validate';
import { putUserSchema, patchUserSchema } from '../validators/authValidator';

const router = Router();
router.use(authenticateToken, checkAdmin); // Requer Admin para todas as rotas

/**
 * @swagger
 * tags:
 * name: Gestão de Usuários
 * description: (Admin) Endpoints para gerenciar usuários do sistema.
 */

/**
 * @swagger
 * /api/users:
 * get:
 * summary: Lista todos os usuários
 * tags: [Gestão de Usuários]
 * responses:
 * '200':
 * description: Lista de usuários
 * content:
 * application/json:
 * schema:
 * type: array
 * items: { $ref: '#/components/schemas/User' }
 * '401':
 * description: Não autorizado
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Error401' }
 * '403':
 * description: Acesso negado (Não é Admin)
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Error403' }
 */
router.get('/', userController.getAll);

/**
 * @swagger
 * /api/users/{id}:
 * get:
 * summary: Obtém detalhes de um usuário
 * tags: [Gestão de Usuários]
 * parameters:
 * - in: path
 * name: id
 * schema: { type: 'string', format: 'uuid' }
 * required: true
 * description: ID do usuário
 * responses:
 * '200':
 * description: Detalhes do usuário
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/User' }
 * '404':
 * description: Usuário não encontrado
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Error404' }
 */
router.get('/:id', userController.getById);

/**
 * @swagger
 * /api/users/{id}:
 * put:
 * summary: (PUT) Substitui os dados de um usuário
 * tags: [Gestão de Usuários]
 * parameters:
 * - in: path
 * name: id
 * schema: { type: 'string', format: 'uuid' }
 * required: true
 * description: ID do usuário
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/UserInput' }
 * responses:
 * '200':
 * description: Usuário atualizado
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message: { type: 'string' }
 * data: { $ref: '#/components/schemas/User' }
 * '400':
 * description: Dados inválidos (requer todos os campos)
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Error400' }
 * '404':
 * description: Usuário não encontrado
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Error404' }
 * '409':
 * description: Conflito (email ou matrícula já em uso)
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Error409' }
 */
router.put('/:id', validate(putUserSchema), userController.update);

/**
 * @swagger
 * /api/users/{id}:
 * patch:
 * summary: (PATCH) Atualiza parcialmente um usuário
 * tags: [Gestão de Usuários]
 * parameters:
 * - in: path
 * name: id
 * schema: { type: 'string', format: 'uuid' }
 * required: true
 * description: ID do usuário
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * nome_guerra: { type: 'string' }
 * tipo_perfil: { type: 'string', enum: ['CHEFE'] }
 * responses:
 * '200':
 * description: Usuário atualizado
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message: { type: 'string' }
 * data: { $ref: '#/components/schemas/User' }
 * '400':
 * description: Dados inválidos (campos opcionais)
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Error400' }
 * '404':
 * description: Usuário não encontrado
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Error404' }
 * '409':
 * description: Conflito (email ou matrícula já em uso)
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Error409' }
 */
router.patch('/:id', validate(patchUserSchema), userController.update);

/**
 * @swagger
 * /api/users/{id}:
 * delete:
 * summary: Deleta um usuário
 * tags: [Gestão de Usuários]
 * parameters:
 * - in: path
 * name: id
 * schema: { type: 'string', format: 'uuid' }
 * required: true
 * description: ID do usuário
 * responses:
 * '200':
 * description: Usuário deletado com sucesso
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/SuccessDelete' }
 * '404':
 * description: Usuário não encontrado
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Error404' }
 * '409':
 * description: Conflito (usuário não pode deletar a si mesmo)
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Error409' }
 */
router.delete('/:id', userController.remove);

export default router;