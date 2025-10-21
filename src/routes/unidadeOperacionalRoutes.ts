import { Router } from 'express';
import * as unidadeController from '../controllers/unidadeOperacionalController';
import { authenticateToken, checkAdmin } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { unidadeSchema } from '../validators/unidadeOperacionalValidator';

const router = Router();
router.use(authenticateToken, checkAdmin);
router.post('/', validate(unidadeSchema), unidadeController.create);
router.get('/', unidadeController.getAll);
router.delete('/:id', unidadeController.remove);

export default router;