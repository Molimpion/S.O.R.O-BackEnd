// src/routes/authRoutes.ts (AJUSTADO)

import { Router } from 'express';
import * as authController from '../controllers/authController';
import { registerSchema, loginSchema } from '../validators/authValidator'; // Importa os dois schemas
import { validate } from '../middleware/validate';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);

router.post('/login', validate(loginSchema), authController.login); // Adiciona a validação aqui também

export default router;