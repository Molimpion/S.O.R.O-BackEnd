import { Router } from 'express';
import subgrupoController from '../controllers/subgrupoController';
import { validate } from '../middleware/validate';
import { createSubgrupoSchema, updateSubgrupoSchema } from '../validators/subgrupoValidator';
import { authenticateAdmin } from '../middleware/authMiddleware';

const router = Router();

// ======================================================
// ==== ANOTAÇÕES SWAGGER (JSDoc) - SUBGRUPOS ====
// ======================================================

/**
 * @swagger
 * tags:
 * name: Admin: Classificação (Natureza, Grupo, Subgrupo)
 * description: (Admin) Endpoints para gerenciar a hierarquia de classificação das ocorrências.
 * /api/v1/subgrupos:  <-- CORRIGIDO
 * post:
 * summary: Cria um novo Subgrupo (apenas Admin)
 * tags: [Admin: Classificação (Natureza, Grupo, Subgrupo)]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Subgrupo'
 * responses:
 * 201:
 * description: Subgrupo criado com sucesso.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Subgrupo'
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
 * description: Conflito (subgrupo já existe).
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error409'
 * get:
 * summary: Lista todos os Subgrupos
 * tags: [Admin: Classificação (Natureza, Grupo, Subgrupo)]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Lista de Subgrupos.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Subgrupo'
 * 401:
 * description: Não autorizado.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error401'
 * /api/v1/subgrupos/{id}:  <-- CORRIGIDO
 * get:
 * summary: Obtém um Subgrupo pelo ID
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
 * description: ID do subgrupo
 * responses:
 * 200:
 * description: Detalhes do Subgrupo.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Subgrupo'
 * 404:
 * description: Subgrupo não encontrado.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error404'
 * put:
 * summary: Atualiza um Subgrupo pelo ID (apenas Admin)
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
 * description: ID do subgrupo
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Subgrupo'
 * responses:
 * 200:
 * description: Subgrupo atualizado com sucesso.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Subgrupo'
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
 * description: Subgrupo não encontrado.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error404'
 * delete:
 * summary: Deleta um Subgrupo pelo ID (apenas Admin)
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
 * description: ID do subgrupo
 * responses:
 * 200:
 * description: Subgrupo deletado com sucesso.
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
 * description: Subgrupo não encontrado.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error404'
 */

// Rotas públicas (GET)
router.get('/', subgrupoController.list);
router.get('/:id', subgrupoController.get);

// Rotas exclusivas de Admin (POST, PUT, DELETE)
router.use(authenticateAdmin);

router.post('/', validate(createSubgrupoSchema), subgrupoController.create);
router.put('/:id', validate(updateSubgrupoSchema), subgrupoController.update);
router.delete('/:id', subgrupoController.remove);

export default router;
