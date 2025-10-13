import { Router } from 'express';
import * as ocorrenciaController from '../controllers/ocorrenciaController';
import { authenticateToken } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
// Adiciona o novo schema de validação
import { createOcorrenciaSchema, listOcorrenciaSchema } from '../validators/ocorrenciaValidator';

const router = Router();

router.use(authenticateToken);

// Aplica a validação de filtros à rota de listagem
router.get('/', validate(listOcorrenciaSchema), ocorrenciaController.listarTodas);

router.get('/:id', ocorrenciaController.getById);

router.post(
  '/',
  validate(createOcorrenciaSchema),
  ocorrenciaController.criar
);

export default router;
