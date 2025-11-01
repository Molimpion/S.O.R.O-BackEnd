import { Router } from 'express';
import * as ocorrenciaController from '../controllers/ocorrenciaController';
import { authenticateToken } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { 
  createOcorrenciaSchema, 
  listOcorrenciaSchema,
  // --- ALTERAÇÃO: Importar ambos os schemas ---
  putOcorrenciaSchema,
  patchOcorrenciaSchema 
} from '../validators/ocorrenciaValidator'; 

const router = Router();
router.use(authenticateToken);
router.get('/', validate(listOcorrenciaSchema), ocorrenciaController.getAll);
router.get('/:id', ocorrenciaController.getById);
router.post(
  '/',
  validate(createOcorrenciaSchema),
  ocorrenciaController.create
);

// --- ALTERAÇÃO: Adicionadas ambas as rotas ---
router.put(
  '/:id', 
  validate(putOcorrenciaSchema), 
  ocorrenciaController.update       
);
router.patch(
  '/:id', 
  validate(patchOcorrenciaSchema), 
  ocorrenciaController.update       
);

export default router;