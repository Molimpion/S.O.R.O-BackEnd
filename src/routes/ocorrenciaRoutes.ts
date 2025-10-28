// src/routes/ocorrenciaRoutes.ts (COM A NOVA ROTA PUT)

import { Router } from 'express';
import * as ocorrenciaController from '../controllers/ocorrenciaController';
import { authenticateToken } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';

// --- ALTERAÇÃO 1: Importar o novo schema ---
import { 
  createOcorrenciaSchema, 
  listOcorrenciaSchema,
  updateOcorrenciaSchema // <-- ADICIONADO (PASSO 1)
} from '../validators/ocorrenciaValidator'; 

const router = Router();

// Aplica o middleware de autenticação a TODAS as rotas neste arquivo.
// Garante que apenas usuários logados (incluindo Analistas) podem acessar.
router.use(authenticateToken);

// Rota GET para listar ocorrências (com filtros e paginação)
router.get('/', validate(listOcorrenciaSchema), ocorrenciaController.getAll);

// Rota GET para obter detalhes de uma ocorrência específica
router.get('/:id', ocorrenciaController.getById);

// Rota POST para criar uma nova ocorrência
router.post(
  '/',
  validate(createOcorrenciaSchema),
  ocorrenciaController.create
);

// ==========================================================
// ADIÇÃO DO PASSO 4 (NOVO CÓDIGO)
// ==========================================================
/**
 * Define a rota PUT para atualizar uma ocorrência pelo seu ID.
 * - O ':id' na URL será capturado e validado pelo 'updateOcorrenciaSchema.params'.
 * - O corpo da requisição (JSON) será validado pelo 'updateOcorrenciaSchema.body'.
 * - Se a validação passar, o 'ocorrenciaController.update' será chamado.
 */
router.put(
  '/:id', // Define que a rota aceita um ID (ex: /api/ocorrencias/uuid-da-ocorrencia)
  validate(updateOcorrenciaSchema), // Aplica nosso schema de validação (Passo 1)
  ocorrenciaController.update       // Chama nosso handler no controller (Passo 3)
);

export default router;