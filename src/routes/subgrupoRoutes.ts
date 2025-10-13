import { Router } from 'express';
import * as subgrupoController from '../controllers/subgrupoController';
import { authenticateToken, checkAdmin } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { subgrupoSchema } from '../validators/subgrupoValidator';

const router = Router();

// Protege todas as rotas, apenas admins podem gerenciar
router.use(authenticateToken, checkAdmin);

router.post('/', validate(subgrupoSchema), subgrupoController.create);
router.get('/', subgrupoController.getAll);
router.delete('/:id', subgrupoController.remove);

export default router;