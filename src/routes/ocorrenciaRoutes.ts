// src/routes/ocorrenciaRoutes.ts
import { Router } from 'express';
import * as ocorrenciaController from '../controllers/ocorrenciaController';
import { authenticateToken } from '../middleware/authMiddleware'; // Importa o porteiro

const router = Router();

// Aplica o porteiro a todas as rotas de ocorrência
router.use(authenticateToken);

router.get('/', ocorrenciaController.listarTodas);
router.post('/', ocorrenciaController.criar);

export default router;