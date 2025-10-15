// src/routes/authRoutes.ts (COM CORREÇÃO FORÇADA)

import { Router } from 'express';
import bodyParser from 'body-parser'; // <-- 1. IMPORTA O BODY-PARSER
import * as authController from '../controllers/authController';
import { registerSchema, loginSchema } from '../validators/authValidator';
import { validate } from '../middleware/validate';

const router = Router();
const jsonParser = bodyParser.json(); // <-- 2. CRIA UMA INSTÂNCIA DO PARSER

// APLICA O JSON PARSER DIRETAMENTE ANTES DA VALIDAÇÃO
router.post('/register', jsonParser, validate(registerSchema), authController.register);
router.post('/login', jsonParser, validate(loginSchema), authController.login);

export default router;