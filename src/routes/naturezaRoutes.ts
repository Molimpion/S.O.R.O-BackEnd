import { Router } from 'express';
import naturezaController from '../controllers/naturezaController';
import { validate } from '../middleware/validate';
import { createNaturezaSchema } from '../validators/naturezaValidator';
import { authenticateAdmin } from '../middleware/authMiddleware';

const router = Router();

// ======================================================
// ==== ANOTAÇÕES SWAGGER (JSDoc) - NATUREZAS ====
// ======================================================

/**
 * @swagger
 * tags:
 * name: Admin: Classificação (Natureza, Grupo, Subgrupo)
 * description: (Admin) Endpoints para gerenciar a hierarquia de classificação das ocorrências.
 * /api/v1/naturezas:  <-- CORRIGIDO
 * post:
 * summary: Cria uma nova Natureza (apenas Admin)
 * tags: [Admin: Classificação (Natureza, Grupo, Subgrupo)]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Natureza'
 * responses:
 * 201:
 * description: Natureza criada com sucesso.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Natureza'
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
 * description: Conflito (natureza já existe).
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error409'
 * get:
 * summary: Lista todas as Naturezas
 * tags: [Admin: Classificação (Natureza, Grupo, Subgrupo)]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Lista de Naturezas.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Natureza'
 * 401:
 * description: Não autorizado.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error401'
 * /api/v1/naturezas/{id}:  <-- CORRIGIDO
 * get:
 * summary: Obtém uma Natureza pelo ID
 * tags: [Admin: Classificação (Natureza, Grupo, Subgrupo)]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * format: uuid
 * description: ID da natureza
 * responses:
 * 200:
 * description: Detalhes da Natureza.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Natureza'
 * 404:
 * description: Natureza não encontrada.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error404'
 * put:
 * summary: Atualiza uma Natureza pelo ID (apenas Admin)
 * tags: [Admin: Classificação (Natureza, Grupo, Subgrupo)]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * format: uuid
 * description: ID da natureza
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Natureza'
 * responses:
 * 200:
 * description: Natureza atualizada com sucesso.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Natureza'
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
 * description: Natureza não encontrada.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error404'
 * delete:
 * summary: Deleta uma Natureza pelo ID (apenas Admin)
 * tags: [Admin: Classificação (Natureza, Grupo, Subgrupo)]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * format: uuid
 * description: ID da natureza
 * responses:
 * 200:
 * description: Natureza deletada com sucesso.
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
 * description: Natureza não encontrada.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error404'
 */

// Rotas públicas (GET)
router.get('/', naturezaController.list);
router.get('/:id', naturezaController.get);

// Rotas exclusivas de Admin (POST, PUT, DELETE)
router.use(authenticateAdmin);

router.post('/', validate(createNaturezaSchema), naturezaController.create);
router.put('/:id', validate(createNaturezaSchema), naturezaController.update);
router.delete('/:id', naturezaController.remove);

export default router;
