// src/routes/authRoutes.ts (CORRIGIDO)

import { Router } from 'express';
// REMOVIDO: import bodyParser from 'body-parser';
import * as authController from '../controllers/authController';
import { registerSchema, loginSchema } from '../validators/authValidator';
import { validate } from '../middleware/validate';

const router = Router();
// REMOVIDO: const jsonParser = bodyParser.json();

// As rotas agora dependem do bodyParser global definido em index.ts
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);

export default router;