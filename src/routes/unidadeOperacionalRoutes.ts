import { Router } from 'express';
import unidadeOperacionalController from '../controllers/unidadeOperacionalController';
import { validate } from '../middleware/validate';
import { createUnidadeOperacionalSchema, updateUnidadeOperacionalSchema } from '../validators/unidadeOperacionalValidator';
import { authenticateAdmin } from '../middleware/authMiddleware';

const router = Router();

// ======================================================
// ==== ANOTAÇÕES SWAGGER (JSDoc) - UNIDADES OP. ====
// ======================================================

/**
 * @swagger
 * tags:
 * name: Admin: Organização (Grupamentos e Unidades)
 * description: (Admin) Endpoints para gerenciar a estrutura organizacional (Grupamentos e Unidades Operacionais).
 * /api/v1/unidades-operacionais:  <-- CORRIGIDO
 * post:
 * summary: Cria uma nova Unidade Operacional (apenas Admin)
 * tags: [Admin: Organização (Grupamentos e Unidades)]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/UnidadeOperacional'
 * responses:
 * 201:
 * description: Unidade Operacional criada com sucesso.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/UnidadeOperacional'
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
 * description: Conflito (unidade operacional já existe).
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error409'
 * get:
 * summary: Lista todas as Unidades Operacionais
 * tags: [Admin: Organização (Grupamentos e Unidades)]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Lista de Unidades Operacionais.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/UnidadeOperacional'
 * 401:
 * description: Não autorizado.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error401'
 * /api/v1/unidades-operacionais/{id}:  <-- CORRIGIDO
 * get:
 * summary: Obtém uma Unidade Operacional pelo ID
 * tags: [Admin: Organização (Grupamentos e Unidades)]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * format: uuid
 * description: ID da unidade operacional
 * responses:
 * 200:
 * description: Detalhes da Unidade Operacional.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/UnidadeOperacional'
 * 404:
 * description: Unidade Operacional não encontrada.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error404'
 * put:
 * summary: Atualiza uma Unidade Operacional pelo ID (apenas Admin)
 * tags: [Admin: Organização (Grupamentos e Unidades)]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * format: uuid
 * description: ID da unidade operacional
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/UnidadeOperacional'
 * responses:
 * 200:
 * description: Unidade Operacional atualizada com sucesso.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/UnidadeOperacional'
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
 * description: Unidade Operacional não encontrada.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error404'
 * delete:
 * summary: Deleta uma Unidade Operacional pelo ID (apenas Admin)
 * tags: [Admin: Organização (Grupamentos e Unidades)]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * format: uuid
 * description: ID da unidade operacional
 * responses:
 * 200:
 * description: Unidade Operacional deletada com sucesso.
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
 * description: Unidade Operacional não encontrada.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error404'
 */

// Rotas públicas (GET)
router.get('/', unidadeOperacionalController.list);
router.get('/:id', unidadeOperacionalController.get);

// Rotas exclusivas de Admin (POST, PUT, DELETE)
router.use(authenticateAdmin);

router.post('/', validate(createUnidadeOperacionalSchema), unidadeOperacionalController.create);
router.put('/:id', validate(updateUnidadeOperacionalSchema), unidadeOperacionalController.update);
router.delete('/:id', unidadeOperacionalController.remove);

export default router;
