import { Router } from 'express';
import relatorioController from '../controllers/relatorioController';
import { authenticateAdmin } from '../middleware/authMiddleware';

const router = Router();

// ======================================================
// ==== ANOTAÇÕES SWAGGER (JSDoc) - RELATÓRIOS ====
// ======================================================

/**
 * @swagger
 * tags:
 * name: Relatórios
 * description: (Admin) Endpoints para exportação de dados em CSV ou PDF.
 * /api/v1/relatorios/export-ocorrencias-csv:  <-- CORRIGIDO
 * get:
 * summary: Exporta a lista completa de ocorrências em formato CSV (apenas Admin)
 * tags: [Relatórios]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Arquivo CSV de ocorrências.
 * content:
 * text/csv:
 * schema:
 * type: string
 * format: binary
 * 403:
 * description: Acesso negado (não é Admin).
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error403'
 */

// Todas as rotas de relatórios são exclusivas de Admin
router.use(authenticateAdmin);

router.get('/export-ocorrencias-csv', relatorioController.exportOcorrenciasToCsv);

export default router;
