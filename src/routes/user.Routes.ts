// src/routes/userRoutes.ts (REFATORADO)

import { Router } from 'express';
// O 'authenticateToken' foi removido daqui, pois será global
import { checkAdmin } from '../middleware/auth.Middleware';
import * as userController from '../controllers/user.Controller';

const router = Router();

// APLICA APENAS O MIDDLEWARE ESPECÍFICO DE ADMIN A TODAS AS ROTAS
router.use(checkAdmin);

// As rotas continuam as mesmas
router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.put('/:id', userController.update);
router.delete('/:id', userController.remove);

export default router;