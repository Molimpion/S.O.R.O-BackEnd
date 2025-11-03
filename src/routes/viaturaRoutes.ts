import { Router } from 'express';
import viaturaController from '../controllers/viaturaController';
import { validate } from '../middleware/validate';
import { createViaturaSchema } from '../validators/viaturaValidator';
import { authenticateAdmin } from '../middleware/authMiddleware';

const router = Router();

// ======================================================
// ==== ANOTAÇÕES SWAGGER (JSDoc) - VIATURAS ====
// ======================================================

/**
 * @swagger
 * tags:
 * name: Admin: Viaturas
 * description: (Admin) Endpoints para gerenciar as viaturas.
 * /api/v1/viaturas:  <-- CORRIGIDO
 * post:
 * summary: Cria uma nova Viatura (apenas Admin)
 * tags: [Admin: Viaturas]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Viatura'
 * responses:
 * 201:
 * description: Viatura criada com sucesso.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Viatura'
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
 * description: Conflito (viatura já existe).
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error409'
 * get:
 * summary: Lista todas as Viaturas
 * tags: [Admin: Viaturas]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Lista de Viaturas.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Viatura'
 * 401:
 * description: Não autorizado.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error401'
 * /api/v1/viaturas/{id}:  <-- CORRIGIDO
 * get:
 * summary: Obtém uma Viatura pelo ID
 * tags: [Admin: Viaturas]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * format: uuid
 * description: ID da viatura
 * responses:
 * 200:
 * description: Detalhes da Viatura.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Viatura'
 * 404:
 * description: Viatura não encontrada.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error404'
 * put:
 * summary: Atualiza uma Viatura pelo ID (apenas Admin)
 * tags: [Admin: Viaturas]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * format: uuid
 * description: ID da viatura
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Viatura'
 * responses:
 * 200:
 * description: Viatura atualizada com sucesso.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Viatura'
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
 * description: Viatura não encontrada.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error404'
 * delete:
 * summary: Deleta uma Viatura pelo ID (apenas Admin)
 * tags: [Admin: Viaturas]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * format: uuid
 * description: ID da viatura
 * responses:
 * 200:
 * description: Viatura deletada com sucesso.
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
 * description: Viatura não encontrada.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error404'
 */

// Rotas públicas (GET)
router.get('/', viaturaController.list);
router.get('/:id', viaturaController.get);

// Rotas exclusivas de Admin (POST, PUT, DELETE)
router.use(authenticateAdmin);

router.post('/', validate(createViaturaSchema), viaturaController.create);
router.put('/:id', validate(createViaturaSchema), viaturaController.update);
router.delete('/:id', viaturaController.remove);

export default router;
