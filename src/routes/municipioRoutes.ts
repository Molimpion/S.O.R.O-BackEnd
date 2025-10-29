import { Router } from 'express';
import * as municipioController from '../controllers/municipioController';
import { authenticateToken, checkAdmin } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { createMunicipioSchema, updateMunicipioSchema } from '../validators/municipioValidator'; // Importa os schemas

const router = Router();

// Aplica autenticação e verificação de admin para todas as rotas de município
router.use(authenticateToken, checkAdmin);

// Rota para criar um novo município
router.post('/', validate(createMunicipioSchema), municipioController.create);

// Rota para listar todos os municípios
router.get('/', municipioController.getAll);

// Rota para buscar um município por ID
router.get('/:id', municipioController.getById);

// Rota para atualizar um município (opcional)
router.put('/:id', validate(updateMunicipioSchema), municipioController.update);

// Rota para deletar um município
router.delete('/:id', municipioController.remove);

export default router;