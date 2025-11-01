import { Router } from 'express';
import * as viaturaController from '../controllers/viaturaController';
import { authenticateToken, checkAdmin } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
// --- ALTERAÇÃO: Importar os 3 schemas ---
import { createViaturaSchema, putViaturaSchema, patchViaturaSchema } from '../validators/viaturaValidator';

const router = Router();
router.use(authenticateToken, checkAdmin);
router.post('/', validate(createViaturaSchema), viaturaController.create);
router.get('/', viaturaController.getAll);

// --- ALTERAÇÃO: Adicionadas ambas as rotas ---
router.put('/:id', validate(putViaturaSchema), viaturaController.update);
router.patch('/:id', validate(patchViaturaSchema), viaturaController.update);

router.delete('/:id', viaturaController.remove);

export default router;