// src/routes/dashboardRoutes.ts

import { Router } from 'express';
import * as dashboardController from '../controllers/dashboardController';
import { authenticateToken } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { listOcorrenciaSchema } from '../validators/ocorrenciaValidator';

const router = Router();

router.use(authenticateToken);

// Rotas de KPI com validação de filtros de query (dataInicio, dataFim, status, etc.)
router.get('/ocorrencias-por-status', validate(listOcorrenciaSchema), dashboardController.getKpiOcorrenciasPorStatus);
router.get('/ocorrencias-por-tipo', validate(listOcorrenciaSchema), dashboardController.getKpiOcorrenciasPorTipo);
router.get('/ocorrencias-por-bairro', validate(listOcorrenciaSchema), dashboardController.getKpiOcorrenciasPorBairro);

export default router;