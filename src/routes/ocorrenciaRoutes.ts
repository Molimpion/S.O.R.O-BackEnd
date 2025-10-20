// src/routes/ocorrenciaRoutes.ts (CORRIGIDO)

import { Router } from 'express';
import * as ocorrenciaController from '../controllers/ocorrenciaController';
import { authenticateToken } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
// Corrigido: Importando apenas os dois schemas necessários para esta rota.
import { createOcorrenciaSchema, listOcorrenciaSchema } from '../validators/ocorrenciaValidator'; 

const router = Router();

router.use(authenticateToken);

router.get('/', validate(listOcorrenciaSchema), ocorrenciaController.getAll);

router.get('/:id', ocorrenciaController.getById);

router.post(
  '/',
  validate(createOcorrenciaSchema),
  ocorrenciaController.create
);

export default router;