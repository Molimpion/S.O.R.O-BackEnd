import { Router } from 'express';
import dashboardController from '../controllers/dashboardController';

const router = Router();

// ======================================================
// ==== ANOTAÇÕES SWAGGER (JSDoc) - DASHBOARD ====
// ======================================================

/**
 * @swagger
 * tags:
 * name: Dashboard
 * description: Endpoints para visualização de KPIs e dados analíticos.
 * /api/v1/dashboard/kpis:  <-- CORRIGIDO
 * get:
 * summary: Retorna os principais KPIs para a dashboard
 * tags: [Dashboard]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Objeto com os KPIs.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * ocorrencias_total:
 * type: integer
 * example: 1500
 * description: Total de ocorrências no período.
 * ocorrencias_concluidas:
 * type: integer
 * example: 1200
 * description: Total de ocorrências concluídas.
 * percentual_conclusao:
 * type: number
 * format: float
 * example: 80.0
 * description: Percentual de ocorrências concluídas.
 * /api/v1/dashboard/ocorrencias-por-natureza:  <-- CORRIGIDO
 * get:
 * summary: Retorna o número de ocorrências agrupadas por natureza (NaturezaPrincipal)
 * tags: [Dashboard]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Lista de contagens por natureza.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * type: object
 * properties:
 * natureza:
 * type: string
 * example: INCENDIO
 * count:
 * type: integer
 * example: 300
 * /api/v1/dashboard/ocorrencias-por-mes:  <-- CORRIGIDO
 * get:
 * summary: Retorna o número de ocorrências agrupadas por mês nos últimos 12 meses
 * tags: [Dashboard]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Lista de contagens por mês.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * type: object
 * properties:
 * mes_ano:
 * type: string
 * example: '2024-10'
 * count:
 * type: integer
 * example: 150
 */

router.get('/kpis', dashboardController.getKpis);
router.get('/ocorrencias-por-natureza', dashboardController.getOcorrenciasPorNatureza);
router.get('/ocorrencias-por-mes', dashboardController.getOcorrenciasPorMes);

export default router;
