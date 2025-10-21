import { Router } from 'express';
import * as relatorioController from '../controllers/relatorioController';
import { authenticateToken, checkAdmin } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { reportOcorrenciaSchema } from '../validators/ocorrenciaValidator'; // <-- Novo Schema

const router = Router();
router.use(authenticateToken, checkAdmin);
router.get('/', validate(reportOcorrenciaSchema), relatorioController.exportRelatorio); // <-- Usa o schema que exige 'type'
export default router;