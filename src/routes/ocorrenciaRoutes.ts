// src/routes/ocorrenciaRoutes.ts (ATUALIZADO)

import { Router } from 'express';
import * as ocorrenciaController from '../controllers/ocorrenciaController';
import { authenticateToken } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { createOcorrenciaSchema } from '../validators/ocorrenciaValidator';

const router = Router();

router.use(authenticateToken);

// Rota para listar todas as ocorrências
router.get('/', ocorrenciaController.listarTodas);

// Rota para buscar uma ocorrência específica por ID
router.get('/:id', ocorrenciaController.getById);

// Rota para criar uma nova ocorrência
router.post(
  '/',
  validate(createOcorrenciaSchema),
  ocorrenciaController.criar
);

export default router;