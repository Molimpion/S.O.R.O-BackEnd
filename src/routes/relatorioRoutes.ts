// src/routes/relatorioRoutes.ts (SIMPLIFICADO)

import { Router } from 'express';
import * as relatorioController from '../controllers/relatorioController';
import { authenticateToken, checkAdmin } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { listOcorrenciaSchema } from '../validators/ocorrenciaValidator';

const router = Router();

router.use(authenticateToken, checkAdmin);

// Rota unificada para exportação de relatórios. O tipo é definido via query param.
// Ex: GET /api/relatorios?type=csv&dataInicio=...
router.get('/', validate(listOcorrenciaSchema), relatorioController.exportRelatorio);

// As rotas anteriores /ocorrencias/csv e /ocorrencias/pdf foram removidas.

export default router;