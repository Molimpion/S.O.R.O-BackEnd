import { Router } from 'express';
import userController from '../controllers/userController';
import { validate } from '../middleware/validate';
import { authenticateAdmin } from '../middleware/authMiddleware';
import { userUpdateSchema } from '../validators/authValidator';

const router = Router();

// ======================================================
// ==== ANOTAÇÕES SWAGGER (JSDoc) - GESTÃO DE USUÁRIOS ====
// ======================================================

/**
 * @swagger
 * tags:
 * name: Gestão de Usuários
 * description: (Admin) Endpoints para gerenciar usuários do sistema.
 * /api/v1/users:  <-- CORRIGIDO
 * get:
 * summary: Lista todos os usuários
 * tags: [Gestão de Usuários]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: query
 * name: search
 * schema:
 * type: string
 * description: Termo de busca (nome, email, matrícula)
 * responses:
 * 200:
 * description: Lista de usuários.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/User'
 * 401:
 * description: Não autorizado.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error401'
 * 403:
 * description: Acesso negado.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error403'
 * /api/v1/users/{id}:  <-- CORRIGIDO
 * get:
 * summary: Obtém um usuário pelo ID
 * tags: [Gestão de Usuários]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * format: uuid
 * description: ID do usuário
 * responses:
 * 200:
 * description: Detalhes do usuário.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/User'
 * 401:
 * description: Não autorizado.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error401'
 * 403:
 * description: Acesso negado.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error403'
 * 404:
 * description: Usuário não encontrado.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error404'
 * put:
 * summary: Atualiza um usuário pelo ID (apenas Admin)
 * tags: [Gestão de Usuários]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * format: uuid
 * description: ID do usuário
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/UserInput'
 * responses:
 * 200:
 * description: Usuário atualizado com sucesso.
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
 * 401:
 * description: Não autorizado.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error401'
 * 403:
 * description: Acesso negado (não é Admin).
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error403'
 * 404:
 * description: Usuário não encontrado.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error404'
 * delete:
 * summary: Deleta um usuário pelo ID (apenas Admin)
 * tags: [Gestão de Usuários]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * format: uuid
 * description: ID do usuário
 * responses:
 * 200:
 * description: Usuário deletado com sucesso.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/SuccessDelete'
 * 401:
 * description: Não autorizado.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error401'
 * 403:
 * description: Acesso negado (não é Admin).
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error403'
 * 404:
 * description: Usuário não encontrado.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error404'
 */

// Rotas: Acesso de Administrador
router.use(authenticateAdmin);

router.get('/', userController.list);
router.get('/:id', userController.get);
router.put('/:id', validate(userUpdateSchema), userController.update);
router.delete('/:id', userController.remove);

export default router;
