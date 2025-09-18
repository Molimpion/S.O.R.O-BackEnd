// src/routes/userRoutes.ts

import { Router } from 'express';
import { authenticateToken, checkAdmin } from '../middleware/authMiddleware';
import * as userController from '../controllers/userController';

const router = Router();

// APLICA OS MIDDLEWARES A TODAS AS ROTAS DESTE ARQUIVO
// 1. Primeiro, 'authenticateToken' verifica se o usuário está logado.
// 2. Se estiver, 'checkAdmin' verifica se o usuário tem o perfil de ADMIN.
// Se qualquer um falhar, a requisição é barrada e não chega no controlador.
router.use(authenticateToken);
router.use(checkAdmin);

// Define as rotas de CRUD para /users
router.get('/', userController.getAll);          // GET /api/users
router.get('/:id', userController.getById);      // GET /api/users/uuid-do-usuario
router.put('/:id', userController.update);       // PUT /api/users/uuid-do-usuario
router.delete('/:id', userController.remove);    // DELETE /api/users/uuid-do-usuario

export default router;