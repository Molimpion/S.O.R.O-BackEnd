import { Router } from 'express';
import * as unidadeController from '../controllers/unidadeOperacionalController';
import { authenticateToken, checkAdmin } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { unidadeSchema } from '../validators/unidadeOperacionalValidator';

const router = Router();
router.use(authenticateToken, checkAdmin); // Requer Admin

/**
 * @swagger
 * /api/unidades-operacionais:
 * post:
 * summary: Cria uma nova Unidade Operacional
 * tags: [Admin: Organização (Grupamentos e Unidades)]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/UnidadeOperacional' }
 * responses:
 * '201':
 * description: Unidade criada
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message: { type: 'string' }
 * data: { $ref: '#/components/schemas/UnidadeOperacional' }
 * '404':
 * description: Grupamento (id_grupamento_fk) não encontrado
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Error404' }
 * get:
 * summary: Lista todas as Unidades Operacionais
 * tags: [Admin: Organização (Grupamentos e Unidades)]
 * responses:
 * '200':
 * description: Lista de unidades (com grupamento aninhado)
 * content:
 * application/json:
 * schema:
 * type: array
 * items: { $ref: '#/components/schemas/UnidadeOperacional' }
 */
router.post('/', validate(unidadeSchema), unidadeController.create);
router.get('/', unidadeController.getAll);

/**
 * @swagger
 * /api/unidades-operacionais/{id}:
 * delete:
 * summary: Deleta uma Unidade Operacional
 * tags: [Admin: Organização (Grupamentos e Unidades)]
 * parameters:
 * - in: path
 * name: id
 * schema: { type: 'string', format: 'uuid' }
 * required: true
 * description: ID da unidade
 * responses:
 * '200':
 * description: Unidade deletada com sucesso
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/SuccessDelete' }
 * '404':
 * description: Unidade não encontrada
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Error404' }
 * '409':
 * description: Conflito (unidade está associada a usuários ou viaturas)
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Error409' }
 */
router.delete('/:id', unidadeController.remove);

export default router;