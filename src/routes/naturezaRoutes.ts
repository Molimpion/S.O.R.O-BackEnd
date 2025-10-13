import { Router } from 'express';
import * as naturezaController from '../controllers/naturezaController';
import { authenticateToken, checkAdmin } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { naturezaSchema } from '../validators/naturezaValidator';

const router = Router();

// Protege todas as rotas, apenas admins podem gerenciar
router.use(authenticateToken, checkAdmin);

router.post('/', validate(naturezaSchema), naturezaController.create);
router.get('/', naturezaController.getAll);
router.delete('/:id', naturezaController.remove);

export default router;