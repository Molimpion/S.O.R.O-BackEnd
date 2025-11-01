import { Router } from 'express';
import * as municipioController from '../controllers/municipioController';
import { authenticateToken, checkAdmin } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
// --- ALTERAÇÃO: Importar os 3 schemas ---
import { createMunicipioSchema, putMunicipioSchema, patchMunicipioSchema } from '../validators/municipioValidator'; 

const router = Router();
router.use(authenticateToken, checkAdmin);
router.post('/', validate(createMunicipioSchema), municipioController.create);
router.get('/', municipioController.getAll);
router.get('/:id', municipioController.getById);

// --- ALTERAÇÃO: Adicionadas ambas as rotas ---
router.put('/:id', validate(putMunicipioSchema), municipioController.update);
router.patch('/:id', validate(patchMunicipioSchema), municipioController.update);

router.delete('/:id', municipioController.remove);

export default router;