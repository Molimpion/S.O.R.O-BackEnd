import { Router } from 'express';
import formaAcervoController from '../controllers/formaAcervoController';
import { validate } from '../middleware/validate';
import { createFormaAcervoSchema } from '../validators/formaAcervoValidator';
import { authenticateAdmin } from '../middleware/authMiddleware';

const router = Router();

// ======================================================
// ==== ANOTAÇÕES SWAGGER (JSDoc) - FORMAS DE ACERVO ====
// ======================================================

/**
 * @swagger
 * tags:
 * name: Admin: Formas de Acervo
 * description: (Admin) Endpoints para gerenciar as formas de acionamento (ex: 193).
 * /api/v1/formas-acervo:  <-- CORRIGIDO
 * post:
 * summary: Cria uma nova Forma de Acervo (apenas Admin)
 * tags: [Admin: Formas de Acervo]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/FormaAcervo'
 * responses:
 * 201:
 * description: Forma de Acervo criada com sucesso.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/FormaAcervo'
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
 * description: Conflito (forma de acervo já existe).
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error409'
 * get:
 * summary: Lista todas as Formas de Acervo
 * tags: [Admin: Formas de Acervo]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Lista de Formas de Acervo.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/FormaAcervo'
 * 401:
 * description: Não autorizado.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error401'
 * /api/v1/formas-acervo/{id}:  <-- CORRIGIDO
 * get:
 * summary: Obtém uma Forma de Acervo pelo ID
 * tags: [Admin: Formas de Acervo]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * format: uuid
 * description: ID da forma de acervo
 * responses:
 * 200:
 * description: Detalhes da Forma de Acervo.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/FormaAcervo'
 * 404:
 * description: Forma de Acervo não encontrada.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error404'
 * put:
 * summary: Atualiza uma Forma de Acervo pelo ID (apenas Admin)
 * tags: [Admin: Formas de Acervo]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * format: uuid
 * description: ID da forma de acervo
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/FormaAcervo'
 * responses:
 * 200:
 * description: Forma de Acervo atualizada com sucesso.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/FormaAcervo'
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
 * description: Forma de Acervo não encontrada.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error404'
 * delete:
 * summary: Deleta uma Forma de Acervo pelo ID (apenas Admin)
 * tags: [Admin: Formas de Acervo]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * format: uuid
 * description: ID da forma de acervo
 * responses:
 * 200:
 * description: Forma de Acervo deletada com sucesso.
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
 * description: Forma de Acervo não encontrada.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error404'
 */

// Rotas públicas (GET)
router.get('/', formaAcervoController.list);
router.get('/:id', formaAcervoController.get);

// Rotas exclusivas de Admin (POST, PUT, DELETE)
router.use(authenticateAdmin);

router.post('/', validate(createFormaAcervoSchema), formaAcervoController.create);
router.put('/:id', validate(createFormaAcervoSchema), formaAcervoController.update);
router.delete('/:id', formaAcervoController.remove);

export default router;
