import { Router } from 'express';
import * as grupoController from '../controllers/grupoController';
import { authenticateToken, checkAdmin } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { grupoSchema } from '../validators/grupoValidator';

const router = Router();
router.use(authenticateToken, checkAdmin);
router.post('/', validate(grupoSchema), grupoController.create);
router.get('/', grupoController.getAll);
router.delete('/:id', grupoController.remove);

export default router;