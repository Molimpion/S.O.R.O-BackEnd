import { Router } from 'express';
import * as relatorioController from '../controllers/relatorioController';
import { authenticateToken, checkAdmin } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { reportOcorrenciaSchema } from '../validators/ocorrenciaValidator'; 

const router = Router();
router.use(authenticateToken, checkAdmin); // Requer Admin

/**
 * @swagger
 * tags:
 * name: Relatórios
 * description: (Admin) Endpoints para exportação de dados em CSV ou PDF.
 */

/**
 * @swagger
 * /api/relatorios:
 * get:
 * summary: Gera um relatório de ocorrências (CSV ou PDF)
 * tags: [Relatórios]
 * parameters:
 * - in: query
 * name: type
 * schema: { type: 'string', enum: ['csv', 'pdf'] }
 * required: true
 * description: Formato do arquivo
 * - in: query
 * name: dataInicio
 * schema: { type: 'string', format: 'date-time' }
 * - in: query
 * name: dataFim
 * schema: { type: 'string', format: 'date-time' }
 * - in: query
 * name: status
 * schema: { type: 'string', enum: ['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO'] }
 * - in: query
 * name: bairroId
 * schema: { type: 'string', format: 'uuid' }
 * - in: query
 * name: subgrupoId
 * schema: { type: 'string', format: 'uuid' }
 * responses:
 * '200':
 * description: Download do arquivo de relatório
 * content:
 * text/csv:
 * schema:
 * type: string
 * application/pdf:
 * schema:
 * type: string
 * format: binary
 * '400':
 * description: Tipo de exportação inválido
 * content:
 * application/json:
 * schema: { $ref: '#/components/schemas/Error400' }
 */
router.get('/', validate(reportOcorrenciaSchema), relatorioController.exportRelatorio);
export default router;