import { Router } from 'express';
import { getKpiOcorrenciasPorStatus, getKpiOcorrenciasPorTipo, getKpiOcorrenciasPorBairro } from '../controllers/dashboardController'; // CORRIGIDO: Importação nomeada
import { authenticateToken } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { listOcorrenciaSchema } from '../validators/ocorrenciaValidator';

const router = Router();

// ======================================================
// ==== ANOTAÇÕES SWAGGER (JSDoc) - DASHBOARD ====
// ======================================================

/**
 * @swagger
 * tags:
 * name: Dashboard
 * description: Endpoints para obtenção de KPIs e estatísticas.
 * /api/v1/dashboard/ocorrencias-por-status: # CORRIGIDO: Prefix /v1 adicionado
 * get:
 * summary: Obtém o número de ocorrências por status
 * tags: [Dashboard]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: query
 * name: ano
 * schema:
 * type: integer
 * description: Ano para filtrar as ocorrências (opcional)
 * - in: query
 * name: mes
 * schema:
 * type: integer
 * description: Mês para filtrar as ocorrências (opcional)
 * - in: query
 * name: unidadeOperacionalId
 * schema:
 * type: string
 * format: uuid
 * description: ID da Unidade Operacional para filtrar (opcional)
 * responses:
 * 200:
 * description: Dados de ocorrências por status.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * type: object
 * properties:
 * status:
 * type: string
 * example: EM_ANDAMENTO
 * count:
 * type: integer
 * example: 15
 * 401:
 * description: Não autorizado.
 * /api/v1/dashboard/ocorrencias-por-tipo: # CORRIGIDO: Prefix /v1 adicionado
 * get:
 * summary: Obtém o número de ocorrências por tipo (Natureza)
 * tags: [Dashboard]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: query
 * name: ano
 * schema:
 * type: integer
 * description: Ano para filtrar as ocorrências (opcional)
 * - in: query
 * name: mes
 * schema:
 * type: integer
 * description: Mês para filtrar as ocorrências (opcional)
 * - in: query
 * name: unidadeOperacionalId
 * schema:
 * type: string
 * format: uuid
 * description: ID da Unidade Operacional para filtrar (opcional)
 * responses:
 * 200:
 * description: Dados de ocorrências por tipo.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * type: object
 * properties:
 * natureza:
 * type: string
 * example: Combate a Incêndio
 * count:
 * type: integer
 * example: 22
 * 401:
 * description: Não autorizado.
 * /api/v1/dashboard/ocorrencias-por-bairro: # CORRIGIDO: Prefix /v1 adicionado
 * get:
 * summary: Obtém o número de ocorrências por bairro
 * tags: [Dashboard]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: query
 * name: ano
 * schema:
 * type: integer
 * description: Ano para filtrar as ocorrências (opcional)
 * - in: query
 * name: mes
 * schema:
 * type: integer
 * description: Mês para filtrar as ocorrências (opcional)
 * - in: query
 * name: unidadeOperacionalId
 * schema:
 * type: string
 * format: uuid
 * description: ID da Unidade Operacional para filtrar (opcional)
 * responses:
 * 200:
 * description: Dados de ocorrências por bairro.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * type: object
 * properties:
 * bairro:
 * type: string
 * example: Centro
 * count:
 * type: integer
 * example: 8
 * 401:
 * description: Não autorizado.
 */

router.use(authenticateToken);
router.get('/ocorrencias-por-status', validate(listOcorrenciaSchema), getKpiOcorrenciasPorStatus);
router.get('/ocorrencias-por-tipo', validate(listOcorrenciaSchema), getKpiOcorrenciasPorTipo);
router.get('/ocorrencias-por-bairro', validate(listOcorrenciaSchema), getKpiOcorrenciasPorBairro);

export default router;
