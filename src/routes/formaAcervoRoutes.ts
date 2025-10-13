import { Router } from 'express';
import * as formaAcervoController from '../controllers/formaAcervoController';
import { authenticateToken, checkAdmin } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { formaAcervoSchema } from '../validators/formaAcervoValidator';

const router = Router();

// Protege todas as rotas, apenas administradores podem gerir
router.use(authenticateToken, checkAdmin);

router.post('/', validate(formaAcervoSchema), formaAcervoController.create);
router.get('/', formaAcervoController.getAll);
router.delete('/:id', formaAcervoController.remove);

export default router;