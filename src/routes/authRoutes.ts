// src/routes/auth.Routes.ts (VERSÃO FINAL CORRIGIDA PARA SEUS ARQUIVOS)

import { Router } from 'express';
// CORREÇÃO: Usando os nomes exatos dos seus arquivos
import * as authController from '../controllers/authController';
import { registerSchema, loginSchema } from '../validators/authValidator';
import { validate } from '../middleware/validate';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);

router.post('/login', validate(loginSchema), authController.login);

export default router;