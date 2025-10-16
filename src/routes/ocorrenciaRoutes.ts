import { Router } from 'express';
import * as ocorrenciaController from '../controllers/ocorrenciaController';
import { authenticateToken } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { createOcorrenciaSchema, listOcorrenciaSchema } from '../validators/ocorrenciaValidator';

const router = Router();

router.use(authenticateToken);

// ATUALIZADO: Chamando 'ocorrenciaController.getAll'
router.get('/', validate(listOcorrenciaSchema), ocorrenciaController.getAll);

router.get('/:id', ocorrenciaController.getById);

// ATUALIZADO: Chamando 'ocorrenciaController.create'
router.post(
  '/',
  validate(createOcorrenciaSchema),
  ocorrenciaController.create
);

export default router;