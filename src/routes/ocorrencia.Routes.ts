// src/routes/ocorrenciaRoutes.ts
import { Router } from 'express';
import * as ocorrenciaController from '../controllers/ocorrencia.Controller';
import { authenticateToken } from '../middleware/auth.Middleware';

const router = Router();

// Rota para listar todas as ocorrências
// Protegeremos com autenticação para garantir que só usuários logados possam ver
router.get('/', authenticateToken, ocorrenciaController.listarTodas);

// Rota para criar uma nova ocorrência
router.post('/', authenticateToken, ocorrenciaController.criar);

export default router;