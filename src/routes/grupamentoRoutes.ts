import { Router } from 'express';
import * as grupamentoController from '../controllers/grupamentoController';
import { authenticateToken, checkAdmin } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { grupamentoSchema } from '../validators/grupamentoValidator';

const router = Router();
router.use(authenticateToken, checkAdmin); // Requer Admin

/**
 * @swagger
 * /api/grupamentos:
 * post:
 * summary: Cria um novo Grupamento
 * tags: [Admin: Organização (Grupamentos e Unidades)]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Grupamento' }
 * responses:
 * '201':
 * description: Grupamento criado
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message: { type: 'string' }
 * data: { $ref: '#/components/schemas/Grupamento' }
 * '409':
 * description: Conflito (sigla ou nome já existe)
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Error409' }
 * get:
 * summary: Lista todos os Grupamentos
 * tags: [Admin: Organização (Grupamentos e Unidades)]
 * responses:
 * '200':
 * description: Lista de grupamentos
 * content:
 * application/json:
 * schema:
 * type: array
 * items: { $ref: '#/components/schemas/Grupamento' }
 */
router.post('/', validate(grupamentoSchema), grupamentoController.create);
router.get('/', grupamentoController.getAll);

/**
 * @swagger
 * /api/grupamentos/{id}:
 * delete:
 * summary: Deleta um Grupamento
 * tags: [Admin: Organização (Grupamentos e Unidades)]
 * parameters:
 * - in: path
 * name: id
 * schema: { type: 'string', format: 'uuid' }
 * required: true
 * description: ID do grupamento
 * responses:
 * '200':
 * description: Grupamento deletado com sucesso
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/SuccessDelete' }
 * '404':
 * description: Grupamento não encontrado
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Error404' }
 * '409':
 * description: Conflito (grupamento está associado a unidades)
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Error409' }
 */
router.delete('/:id', grupamentoController.remove);

export default router;