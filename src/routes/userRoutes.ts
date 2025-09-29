// src/routes/userRoutes.ts (CORRIGIDO)

import { Router } from 'express';
import { authenticateToken, checkAdmin } from '../middleware/authMiddleware';
import * as userController from '../controllers/userController'; // Corrigido o caminho também

const router = Router();

router.use(authenticateToken);
router.use(checkAdmin);

// CORREÇÃO: Usando 'userController' em vez de 'user'
router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.put('/:id', userController.update);
router.delete('/:id', userController.remove);

export default router;