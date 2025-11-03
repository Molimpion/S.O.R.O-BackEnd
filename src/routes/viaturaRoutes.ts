import { Router } from 'express';
import { create, getAll, remove } from '../controllers/viaturaController'; // CORRIGIDO: Importação nomeada
import { authenticateAdmin } from '../middleware/authMiddleware'; // CORRIGIDO: Middleware
import { validate } from '../middleware/validate';
import { viaturaSchema } from '../validators/viaturaValidator'; // CORRIGIDO: Nome do schema

const router = Router();

// ======================================================
// ==== ANOTAÇÕES SWAGGER (JSDoc) - VIATURAS ====
// ======================================================

/**
 * @swagger
 * tags:
 * name: Admin: Viaturas
 * description: (Admin) Endpoints para gerenciar as viaturas.
 * /api/v1/viaturas: # CORRIGIDO: Prefix /v1 adicionado
 * post:
 * summary: Cria uma nova viatura (apenas Admin)
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
 * 400:
 * description: Erro de validação.
 * 403:
 * description: Acesso negado (não é Admin).
 * 409:
 * description: Conflito (viatura já existe).
 * get:
 * summary: Lista todas as viaturas
 * tags: [Admin: Viaturas]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Lista de viaturas.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Viatura'
 * 401:
 * description: Não autorizado.
 * /api/v1/viaturas/{id}: # CORRIGIDO: Prefix /v1 adicionado
 * delete:
 * summary: Deleta uma viatura pelo ID (apenas Admin)
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
 * 403:
 * description: Acesso negado (não é Admin).
 * 404:
 * description: Viatura não encontrada.
 */

router.use(authenticateAdmin);

router.post('/', validate(viaturaSchema), create);
router.get('/', getAll);
router.delete('/:id', remove);

export default router;
