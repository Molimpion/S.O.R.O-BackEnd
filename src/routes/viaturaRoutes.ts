import { Router } from 'express';
import * as viaturaController from '../controllers/viaturaController';
import { authenticateToken, checkAdmin } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { viaturaSchema } from '../validators/viaturaValidator';

const router = Router();
router.use(authenticateToken, checkAdmin);
router.post('/', validate(viaturaSchema), viaturaController.create);
router.get('/', viaturaController.getAll);
router.delete('/:id', viaturaController.remove);

export default router;