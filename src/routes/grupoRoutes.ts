import { Router } from 'express';
import grupoController from '../controllers/grupoController';
import { validate } from '../middleware/validate';
import { createGrupoSchema, updateGrupoSchema } from '../validators/grupoValidator';
import { authenticateAdmin } from '../middleware/authMiddleware';

const router = Router();

// ======================================================
// ==== ANOTAÇÕES SWAGGER (JSDoc) - GRUPOS ====
// ======================================================

/**
 * @swagger
 * tags:
 * name: Admin: Classificação (Natureza, Grupo, Subgrupo)
 * description: (Admin) Endpoints para gerenciar a hierarquia de classificação das ocorrências.
 * /api/v1/grupos:  <-- CORRIGIDO
 * post:
 * summary: Cria um novo Grupo (apenas Admin)
 * tags: [Admin: Classificação (Natureza, Grupo, Subgrupo)]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Grupo'
 * responses:
 * 201:
 * description: Grupo criado com sucesso.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Grupo'
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
 * description: Conflito (grupo já existe).
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error409'
 * get:
 * summary: Lista todos os Grupos
 * tags: [Admin: Classificação (Natureza, Grupo, Subgrupo)]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Lista de Grupos.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Grupo'
 * 401:
 * description: Não autorizado.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error401'
 * /api/v1/grupos/{id}:  <-- CORRIGIDO
 * get:
 * summary: Obtém um Grupo pelo ID
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
 * description: ID do grupo
 * responses:
 * 200:
 * description: Detalhes do Grupo.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Grupo'
 * 404:
 * description: Grupo não encontrado.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error404'
 * put:
 * summary: Atualiza um Grupo pelo ID (apenas Admin)
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
 * description: ID do grupo
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Grupo'
 * responses:
 * 200:
 * description: Grupo atualizado com sucesso.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Grupo'
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
 * description: Grupo não encontrado.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error404'
 * delete:
 * summary: Deleta um Grupo pelo ID (apenas Admin)
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
 * description: ID do grupo
 * responses:
 * 200:
 * description: Grupo deletado com sucesso.
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
 * description: Grupo não encontrado.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error404'
 */

// Rotas públicas (GET)
router.get('/', grupoController.list);
router.get('/:id', grupoController.get);

// Rotas exclusivas de Admin (POST, PUT, DELETE)
router.use(authenticateAdmin);

router.post('/', validate(createGrupoSchema), grupoController.create);
router.put('/:id', validate(updateGrupoSchema), grupoController.update);
router.delete('/:id', grupoController.remove);

export default router;
