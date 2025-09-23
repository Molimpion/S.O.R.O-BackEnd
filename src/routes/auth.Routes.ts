// src/routes/authRoutes.ts (AJUSTADO)

import { Router } from 'express';
import * as authController from '../controllers/auth.Controller';
import { registerSchema, loginSchema } from '../validators/auth.Validator'; // Importa os dois schemas
import { validate } from '../middleware/validate';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);

router.post('/login', validate(loginSchema), authController.login); // Adiciona a validação aqui também

export default router;