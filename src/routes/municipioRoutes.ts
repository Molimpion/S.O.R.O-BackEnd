import { Router } from 'express';
import * as municipioController from '../controllers/municipioController';
import { authenticateToken, checkAdmin } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { municipioSchema } from '../validators/municipioValidator';

const router = Router();

// Protege todas as rotas de município, só admins podem gerenciar
router.use(authenticateToken, checkAdmin);

router.post('/', validate(municipioSchema), municipioController.create);
router.get('/', municipioController.getAll);
router.get('/:id', municipioController.getById);
router.put('/:id', validate(municipioSchema), municipioController.update);
router.delete('/:id', municipioController.remove);

export default router;
