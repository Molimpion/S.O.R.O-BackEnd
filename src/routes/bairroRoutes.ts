import { Router } from 'express';
import * as bairroController from '../controllers/bairroController';
import { authenticateToken, checkAdmin } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { createBairroSchema, putBairroSchema, patchBairroSchema } from '../validators/bairroValidator';

const router = Router();
router.use(authenticateToken, checkAdmin);
router.post('/', validate(createBairroSchema), bairroController.create);
router.get('/', bairroController.getAll);
router.get('/:id', bairroController.getById);
router.put('/:id', validate(putBairroSchema), bairroController.update);
router.patch('/:id', validate(patchBairroSchema), bairroController.update);

router.delete('/:id', bairroController.remove);

export default router;