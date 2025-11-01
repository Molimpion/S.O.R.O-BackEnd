import { Router } from 'express';
import * as dashboardController from '../controllers/dashboardController';
import { authenticateToken } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { listOcorrenciaSchema } from '../validators/ocorrenciaValidator';

const router = Router();
router.use(authenticateToken); // Requer autenticação

/**
 * @swagger
 * tags:
 * name: Dashboard
 * description: Endpoints para visualização de KPIs e dados analíticos.
 */

/**
 * @swagger
 * /api/dashboard/ocorrencias-por-status:
 * get:
 * summary: KPI de Ocorrências por Status
 * tags: [Dashboard]
 * parameters:
 * - in: query
 * name: dataInicio
 * schema: { type: 'string', format: 'date-time' }
 * - in: query
 * name: dataFim
 * schema: { type: 'string', format: 'date-time' }
 * - in: query
 * name: bairroId
 * schema: { type: 'string', format: 'uuid' }
 * responses:
 * '200':
 * description: Contagem de ocorrências por status
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * PENDENTE: { type: 'integer' }
 * EM_ANDAMENTO: { type: 'integer' }
 * CONCLUIDO: { type: 'integer' }
 * CANCELADO: { type: 'integer' }
 */
router.get('/ocorrencias-por-status', validate(listOcorrenciaSchema), dashboardController.getKpiOcorrenciasPorStatus);

/**
 * @swagger
 * /api/dashboard/ocorrencias-por-tipo:
 * get:
 * summary: KPI de Ocorrências por Tipo (Subgrupo)
 * tags: [Dashboard]
 * parameters:
 * - in: query
 * name: dataInicio
 * schema: { type: 'string', format: 'date-time' }
 * - in: query
 * name: dataFim
 * schema: { type: 'string', format: 'date-time' }
 * responses:
 * '200':
 * description: Lista de totais por subgrupo
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * type: object
 * properties:
 * nome: { type: 'string' }
 * total: { type: 'integer' }
 */
router.get('/ocorrencias-por-tipo', validate(listOcorrenciaSchema), dashboardController.getKpiOcorrenciasPorTipo);

/**
 * @swagger
 * /api/dashboard/ocorrencias-por-bairro:
 * get:
 * summary: KPI de Ocorrências por Bairro
 * tags: [Dashboard]
 * parameters:
 * - in: query
 * name: dataInicio
 * schema: { type: 'string', format: 'date-time' }
 * - in: query
 * name: dataFim
 * schema: { type: 'string', format: 'date-time' }
 * responses:
 * '200':
 * description: Lista de totais por bairro
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * type: object
 * properties:
 * nome: { type: 'string' }
 * total: { type: 'integer' }
 */
router.get('/ocorrencias-por-bairro', validate(listOcorrenciaSchema), dashboardController.getKpiOcorrenciasPorBairro);

export default router;