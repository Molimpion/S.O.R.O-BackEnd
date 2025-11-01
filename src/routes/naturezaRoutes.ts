import { Router } from 'express';
import * as naturezaController from '../controllers/naturezaController';
import { authenticateToken, checkAdmin } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { naturezaSchema } from '../validators/naturezaValidator';

const router = Router();
router.use(authenticateToken, checkAdmin); // Requer Admin

/**
 * @swagger
 * /api/naturezas:
 * post:
 * summary: Cria uma nova Natureza
 * tags: [Admin: Classificação (Natureza, Grupo, Subgrupo)]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Natureza' }
 * responses:
 * '201':
 * description: Natureza criada
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message: { type: 'string' }
 * data: { $ref: '#/components/schemas/Natureza' }
 * '409':
 * description: Natureza com esta descrição já existe
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Error409' }
 * get:
 * summary: Lista todas as Naturezas
 * tags: [Admin: Classificação (Natureza, Grupo, Subgrupo)]
 * responses:
 * '200':
 * description: Lista de naturezas
 * content:
 * application/json:
 * schema:
 * type: array
 * items: { $ref: '#/components/schemas/Natureza' }
 */
router.post('/', validate(naturezaSchema), naturezaController.create);
router.get('/', naturezaController.getAll);

/**
 * @swagger
 * /api/naturezas/{id}:
 * delete:
 * summary: Deleta uma Natureza
 * tags: [Admin: Classificação (Natureza, Grupo, Subgrupo)]
 * parameters:
 * - in: path
 * name: id
 * schema: { type: 'string', format: 'uuid' }
 * required: true
 * description: ID da natureza
 * responses:
 * '200':
 * description: Natureza deletada com sucesso
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/SuccessDelete' }
 * '404':
 * description: Natureza não encontrada
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Error404' }
 * '409':
 * description: Conflito (natureza está associada a grupos)
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Error409' }
 */
router.delete('/:id', naturezaController.remove);

export default router;