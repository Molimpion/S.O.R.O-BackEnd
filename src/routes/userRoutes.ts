import { Router } from 'express';
import { authenticateAdmin } from '../middleware/authMiddleware'; 
import { getAll, getById, update, remove } from '../controllers/userController'; // CORRIGIDO: Importação nomeada
import { validate } from '../middleware/validate';
import { userUpdateSchema } from '../validators/authValidator'; // CORRIGIDO: userUpdateSchema é o nome correto

const router = Router();

// ======================================================
// ==== ANOTAÇÕES SWAGGER (JSDoc) - USERS ====
// ======================================================

/**
 * @swagger
 * tags:
 * name: Admin: Usuários
 * description: (Admin) Endpoints para gerenciar os usuários.
 * /api/v1/users: 
 * get:
 * summary: Lista todos os usuários (apenas Admin)
 * tags: [Admin: Usuários]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Lista de usuários.
 * 403:
 * description: Acesso negado (não é Admin).
 * /api/v1/users/{id}: 
 * get:
 * summary: Obtém um usuário pelo ID (apenas Admin)
 * tags: [Admin: Usuários]
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
 * 404:
 * description: Usuário não encontrado.
 * put:
 * summary: Atualiza um usuário pelo ID (apenas Admin)
 * tags: [Admin: Usuários]
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
 * $ref: '#/components/schemas/UserUpdate'
 * responses:
 * 200:
 * description: Usuário atualizado com sucesso.
 * 400:
 * description: Erro de validação.
 * 403:
 * description: Acesso negado (não é Admin).
 * 404:
 * description: Usuário não encontrado.
 * delete:
 * summary: Deleta um usuário pelo ID (apenas Admin)
 * tags: [Admin: Usuários]
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
 * 403:
 * description: Acesso negado (não é Admin).
 * 404:
 * description: Usuário não encontrado.
 */

router.use(authenticateAdmin);

router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', validate(userUpdateSchema), update);
router.delete('/:id', remove);

export default router;
