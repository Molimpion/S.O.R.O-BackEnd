import { Router } from 'express';
import * as relatorioController from '../controllers/relatorioController';
import { authenticateToken, checkAdmin } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { listOcorrenciaSchema } from '../validators/ocorrenciaValidator';

const router = Router();

router.use(authenticateToken, checkAdmin);

router.get('/ocorrencias/csv', validate(listOcorrenciaSchema), relatorioController.exportCsv);
router.get('/ocorrencias/pdf', validate(listOcorrenciaSchema), relatorioController.exportPdf);

export default router;