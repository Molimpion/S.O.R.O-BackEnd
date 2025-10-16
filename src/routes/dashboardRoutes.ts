import { Router } from 'express';
import * as dashboardController from '../controllers/dashboardController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/ocorrencias-por-status', dashboardController.getKpiOcorrenciasPorStatus);
router.get('/ocorrencias-por-tipo', dashboardController.getKpiOcorrenciasPorTipo);
router.get('/ocorrencias-por-bairro', dashboardController.getKpiOcorrenciasPorBairro);

export default router;