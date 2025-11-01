import { Router } from 'express';
import * as viaturaController from '../controllers/viaturaController';
import { authenticateToken, checkAdmin } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { createViaturaSchema, putViaturaSchema, patchViaturaSchema } from '../validators/viaturaValidator';

const router = Router();
router.use(authenticateToken, checkAdmin); // Requer Admin

/**
 * @swagger
 * /api/viaturas:
 * post:
 * summary: Cria uma nova viatura
 * tags: [Admin: Viaturas]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Viatura' }
 * responses:
 * '201':
 * description: Viatura criada
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message: { type: 'string' }
 * data: { $ref: '#/components/schemas/Viatura' }
 * '404':
 * description: Unidade Operacional (id_unidade_operacional_fk) não encontrada
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Error404' }
 * '409':
 * description: Viatura com este número já existe
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Error409' }
 * get:
 * summary: Lista todas as viaturas
 * tags: [Admin: Viaturas]
 * responses:
 * '200':
 * description: Lista de viaturas (com unidade aninhada)
 * content:
 * application/json:
 * schema:
 * type: array
 * items: { $ref: '#/components/schemas/Viatura' }
 */
router.post('/', validate(createViaturaSchema), viaturaController.create);
router.get('/', viaturaController.getAll);

/**
 * @swagger
 * /api/viaturas/{id}:
 * put:
 * summary: (PUT) Substitui os dados de uma viatura
 * tags: [Admin: Viaturas]
 * parameters:
 * - in: path
 * name: id
 * schema: { type: 'string', format: 'uuid' }
 * required: true
 * description: ID da viatura
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Viatura' }
 * responses:
 * '200':
 * description: Viatura atualizada
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message: { type: 'string' }
 * data: { $ref: '#/components/schemas/Viatura' }
 * '404':
 * description: Viatura ou Unidade Operacional não encontrada
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Error404' }
 * '409':
 * description: Conflito (número da viatura já em uso)
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Error409' }
 * patch:
 * summary: (PATCH) Atualiza parcialmente uma viatura
 * tags: [Admin: Viaturas]
 * parameters:
 * - in: path
 * name: id
 * schema: { type: 'string', format: 'uuid' }
 * required: true
 * description: ID da viatura
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * tipo_vt: { type: 'string' }
 * responses:
 * '200':
 * description: Viatura atualizada
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message: { type: 'string' }
 * data: { $ref: '#/components/schemas/Viatura' }
 * '404':
 * description: Viatura ou Unidade Operacional não encontrada
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Error404' }
 * '409':
 * description: Conflito (número da viatura já em uso)
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Error409' }
 * delete:
 * summary: Deleta uma viatura
 * tags: [Admin: Viaturas]
 * parameters:
 * - in: path
 * name: id
 * schema: { type: 'string', format: 'uuid' }
 * required: true
 * description: ID da viatura
 * responses:
 * '200':
 * description: Viatura deletada com sucesso
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/SuccessDelete' }
 * '404':
 * description: Viatura não encontrada
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Error404' }
 * '409':
 * description: Conflito (viatura está associada a ocorrências)
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Error409' }
 */
router.put('/:id', validate(putViaturaSchema), viaturaController.update);
router.patch('/:id', validate(patchViaturaSchema), viaturaController.update);
router.delete('/:id', viaturaController.remove);

export default router;