import { Router } from 'express';
import { authenticateToken, checkAdmin } from '../middleware/authMiddleware';
import * as userController from '../controllers/userController';
import { validate } from '../middleware/validate';
import { userUpdateSchema } from '../validators/authValidator';

const router = Router();
router.use(authenticateToken, checkAdmin);
router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.put('/:id', validate(userUpdateSchema), userController.update);
router.delete('/:id', userController.remove);

export default router;