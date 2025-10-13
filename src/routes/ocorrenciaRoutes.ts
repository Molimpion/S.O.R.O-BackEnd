// src/routes/ocorrenciaRoutes.ts (ATUALIZADO COM VALIDAÇÃO)

import { Router } from 'express';
import * as ocorrenciaController from '../controllers/ocorrenciaController';
import { authenticateToken } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { createOcorrenciaSchema } from '../validators/ocorrenciaValidator';

const router = Router();

router.use(authenticateToken);

// A rota GET continua a mesma
router.get('/', ocorrenciaController.listarTodas);

// A rota POST agora tem o middleware de validação
router.post(
  '/',
  validate(createOcorrenciaSchema), // 3. APLICA A VALIDAÇÃO AQUI
  ocorrenciaController.criar
);

export default router;