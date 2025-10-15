import { Router } from 'express';
import * as grupamentoController from '../controllers/grupamentoController';
import { authenticateToken, checkAdmin } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { grupamentoSchema } from '../validators/grupamentoValidator';

const router = Router();

// Protege todas as rotas de grupamento, apenas administradores podem gerir
router.use(authenticateToken, checkAdmin);

// Define as rotas
router.post('/', validate(grupamentoSchema), grupamentoController.create);
router.get('/', grupamentoController.getAll);
router.delete('/:id', grupamentoController.remove);

export default router;