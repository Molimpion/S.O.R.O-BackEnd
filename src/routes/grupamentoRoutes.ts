import { Router } from 'express';
import grupamentoController from '../controllers/grupamentoController';
import { validate } from '../middleware/validate';
import { createGrupamentoSchema } from '../validators/grupamentoValidator';
import { authenticateAdmin } from '../middleware/authMiddleware';

const router = Router();

// ======================================================
// ==== ANOTAÇÕES SWAGGER (JSDoc) - GRUPAMENTOS ====
// ======================================================

/**
 * @swagger
 * tags:
 * name: Admin: Organização (Grupamentos e Unidades)
 * description: (Admin) Endpoints para gerenciar a estrutura organizacional (Grupamentos e Unidades Operacionais).
 * /api/v1/grupamentos:  <-- CORRIGIDO
 * post:
 * summary: Cria um novo Grupamento (apenas Admin)
 * tags: [Admin: Organização (Grupamentos e Unidades)]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Grupamento'
 * responses:
 * 201:
 * description: Grupamento criado com sucesso.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Grupamento'
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
 * description: Conflito (grupamento já existe).
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error409'
 * get:
 * summary: Lista todos os Grupamentos
 * tags: [Admin: Organização (Grupamentos e Unidades)]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Lista de Grupamentos.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Grupamento'
 * 401:
 * description: Não autorizado.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error401'
 * /api/v1/grupamentos/{id}:  <-- CORRIGIDO
 * get:
 * summary: Obtém um Grupamento pelo ID
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
 * description: ID do grupamento
 * responses:
 * 200:
 * description: Detalhes do Grupamento.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Grupamento'
 * 404:
 * description: Grupamento não encontrado.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error404'
 * put:
 * summary: Atualiza um Grupamento pelo ID (apenas Admin)
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
 * description: ID do grupamento
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Grupamento'
 * responses:
 * 200:
 * description: Grupamento atualizado com sucesso.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Grupamento'
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
 * description: Grupamento não encontrado.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error404'
 * delete:
 * summary: Deleta um Grupamento pelo ID (apenas Admin)
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
 * description: ID do grupamento
 * responses:
 * 200:
 * description: Grupamento deletado com sucesso.
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
 * description: Grupamento não encontrado.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error404'
 */

// Rotas públicas (GET)
router.get('/', grupamentoController.list);
router.get('/:id', grupamentoController.get);

// Rotas exclusivas de Admin (POST, PUT, DELETE)
router.use(authenticateAdmin);

router.post('/', validate(createGrupamentoSchema), grupamentoController.create);
router.put('/:id', validate(createGrupamentoSchema), grupamentoController.update);
router.delete('/:id', grupamentoController.remove);

export default router;
