import { Router } from 'express';
import * as municipioController from '../controllers/municipioController';
import { authenticateToken, checkAdmin } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { createMunicipioSchema, putMunicipioSchema, patchMunicipioSchema } from '../validators/municipioValidator'; 

const router = Router();
router.use(authenticateToken, checkAdmin); // Requer Admin

/**
 * @swagger
 * /api/municipios:
 * post:
 * summary: Cria um novo município
 * tags: [Admin: Municípios]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Municipio' }
 * responses:
 * '201':
 * description: Município criado
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message: { type: 'string' }
 * data: { $ref: '#/components/schemas/Municipio' }
 * '409':
 * description: Município com este nome já existe
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Error409' }
 * get:
 * summary: Lista todos os municípios
 * tags: [Admin: Municípios]
 * responses:
 * '200':
 * description: Lista de municípios
 * content:
 * application/json:
 * schema:
 * type: array
 * items: { $ref: '#/components/schemas/Municipio' }
 */
router.post('/', validate(createMunicipioSchema), municipioController.create);
router.get('/', municipioController.getAll);

/**
 * @swagger
 * /api/municipios/{id}:
 * get:
 * summary: Obtém detalhes de um município
 * tags: [Admin: Municípios]
 * parameters:
 * - in: path
 * name: id
 * schema: { type: 'string', format: 'uuid' }
 * required: true
 * description: ID do município
 * responses:
 * '200':
 * description: Detalhes do município
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Municipio' }
 * '404':
 * description: Município não encontrado
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Error404' }
 * put:
 * summary: (PUT) Substitui o nome de um município
 * tags: [Admin: Municípios]
 * parameters:
 * - in: path
 * name: id
 * schema: { type: 'string', format: 'uuid' }
 * required: true
 * description: ID do município
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * nome_municipio: { type: 'string' }
 * responses:
 * '200':
 * description: Município atualizado
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message: { type: 'string' }
 * data: { $ref: '#/components/schemas/Municipio' }
 * '404':
 * description: Município não encontrado
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Error404' }
 * '409':
 * description: Conflito (nome já em uso)
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Error409' }
 * patch:
 * summary: (PATCH) Atualiza o nome de um município
 * tags: [Admin: Municípios]
 * parameters:
 * - in: path
 * name: id
 * schema: { type: 'string', format: 'uuid' }
 * required: true
 * description: ID do município
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * nome_municipio: { type: 'string' }
 * responses:
 * '200':
 * description: Município atualizado
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message: { type: 'string' }
 * data: { $ref: '#/components/schemas/Municipio' }
 * '404':
 * description: Município não encontrado
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Error404' }
 * '409':
 * description: Conflito (nome já em uso)
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Error409' }
 * delete:
 * summary: Deleta um município
 * tags: [Admin: Municípios]
 * parameters:
 * - in: path
 * name: id
 * schema: { type: 'string', format: 'uuid' }
 * required: true
 * description: ID do município
 * responses:
 * '200':
 * description: Município deletado com sucesso
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/SuccessDelete' }
 * '404':
 * description: Município não encontrado
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Error404' }
 * '409':
 * description: Conflito (município está associado a bairros)
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Error409' }
 */
router.get('/:id', municipioController.getById);
router.put('/:id', validate(putMunicipioSchema), municipioController.update);
router.patch('/:id', validate(patchMunicipioSchema), municipioController.update);
router.delete('/:id', municipioController.remove);

export default router;