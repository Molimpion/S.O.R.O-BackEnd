import { Router } from 'express';
import * as relatorioController from '../controllers/relatorioController';
import { authenticateToken, checkAdmin } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { listOcorrenciaSchema } from '../validators/ocorrenciaValidator';

const router = Router();

// A geração de relatórios também será uma rota protegida para administradores
router.use(authenticateToken, checkAdmin);

// Usamos o mesmo validador da listagem, pois os filtros são os mesmos
router.get('/ocorrencias/csv', validate(listOcorrenciaSchema), relatorioController.exportOcorrenciasCSV);
router.get('/ocorrencias/pdf', validate(listOcorrenciaSchema), relatorioController.exportOcorrenciasPDF);

export default router;