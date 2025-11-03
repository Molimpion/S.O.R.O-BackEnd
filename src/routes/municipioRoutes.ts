import { Router } from 'express';
import municipioController from '../controllers/municipioController';
import { validate } from '../middleware/validate';
import { createMunicipioSchema } from '../validators/municipioValidator';
import { authenticateAdmin } from '../middleware/authMiddleware';

const router = Router();

// ======================================================
// ==== ANOTAÇÕES SWAGGER (JSDoc) - MUNICÍPIOS ====
// ======================================================

/**
 * @swagger
 * tags:
 * name: Admin: Municípios
 * description: (Admin) Endpoints para gerenciar os municípios.
 * /api/v1/municipios:  <-- CORRIGIDO
 * post:
 * summary: Cria um novo município (apenas Admin)
 * tags: [Admin: Municípios]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Municipio'
 * responses:
 * 201:
 * description: Município criado com sucesso.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Municipio'
 * 400:
 * description: Erro de validação.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error400'
 * 403:
 * description: Acesso negado (não é Admin).
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error403'
 * 409:
 * description: Conflito (município já existe).
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error409'
 * get:
 * summary: Lista todos os municípios
 * tags: [Admin: Municípios]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Lista de municípios.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Municipio'
 * 401:
 * description: Não autorizado.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error401'
 * /api/v1/municipios/{id}:  <-- CORRIGIDO
 * get:
 * summary: Obtém um município pelo ID
 * tags: [Admin: Municípios]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * format: uuid
 * description: ID do município
 * responses:
 * 200:
 * description: Detalhes do município.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Municipio'
 * 404:
 * description: Município não encontrado.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error404'
 * put:
 * summary: Atualiza um município pelo ID (apenas Admin)
 * tags: [Admin: Municípios]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * format: uuid
 * description: ID do município
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Municipio'
 * responses:
 * 200:
 * description: Município atualizado com sucesso.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Municipio'
 * 400:
 * description: Erro de validação.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error400'
 * 403:
 * description: Acesso negado (não é Admin).
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error403'
 * 404:
 * description: Município não encontrado.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error404'
 * delete:
 * summary: Deleta um município pelo ID (apenas Admin)
 * tags: [Admin: Municípios]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * format: uuid
 * description: ID do município
 * responses:
 * 200:
 * description: Município deletado com sucesso.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/SuccessDelete'
 * 403:
 * description: Acesso negado (não é Admin).
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error403'
 * 404:
 * description: Município não encontrado.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error404'
 */

// Rotas públicas (GET)
router.get('/', municipioController.list);
router.get('/:id', municipioController.get);

// Rotas exclusivas de Admin (POST, PUT, DELETE)
router.use(authenticateAdmin);

router.post('/', validate(createMunicipioSchema), municipioController.create);
router.put('/:id', validate(createMunicipioSchema), municipioController.update);
router.delete('/:id', municipioController.remove);

export default router;
