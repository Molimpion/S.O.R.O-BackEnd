import { Router } from "express";
import {
  getKpiOcorrenciasPorStatus,
  getKpiOcorrenciasPorTipo,
  getKpiOcorrenciasPorBairro,
  getKpiOcorrenciasPorMunicipio,
  getKpiOcorrenciasPorPeriodo,
  getKpiAvgCompletionTime,
} from "../controllers/dashboardController";
import { authenticateToken } from "../middleware/authMiddleware";
import { validate } from "../middleware/validate";
import { listOcorrenciaSchema } from "../validators/ocorrenciaValidator";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Dashboard
 *     description: Endpoints para obtenção de KPIs e estatísticas.
 *
 * components:
 *   parameters:
 *     dataInicio:
 *       in: query
 *       name: dataInicio
 *       schema:
 *         type: string
 *         format: date-time
 *       description: Filtrar por data de início (opcional)
 *     dataFim:
 *       in: query
 *       name: dataFim
 *       schema:
 *         type: string
 *         format: date-time
 *       description: Filtrar por data de fim (opcional)
 *     status:
 *       in: query
 *       name: status
 *       schema:
 *         type: string
 *         enum: [PENDENTE, EM_ANDAMENTO, CONCLUIDO, CANCELADO]
 *       description: Filtrar por status (opcional)
 *     bairroId:
 *       in: query
 *       name: bairroId
 *       schema:
 *         type: string
 *         format: uuid
 *       description: ID do Bairro para filtrar (opcional)
 *     subgrupoId:
 *       in: query
 *       name: subgrupoId
 *       schema:
 *         type: string
 *         format: uuid
 *       description: ID do Subgrupo para filtrar (opcional)
 *
 * /api/v3/dashboard/ocorrencias-por-status:
 *   get:
 *     summary: Obtém o número de ocorrências por status
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/dataInicio'
 *       - $ref: '#/components/parameters/dataFim'
 *       - $ref: '#/components/parameters/subgrupoId'
 *     responses:
 *       '200':
 *         description: Dados de ocorrências por status.
 *
 * /api/v3/dashboard/ocorrencias-por-tipo:
 *   get:
 *     summary: Obtém o top 10 de ocorrências por tipo (Subgrupo)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/dataInicio'
 *       - $ref: '#/components/parameters/dataFim'
 *       - $ref: '#/components/parameters/bairroId'
 *     responses:
 *       '200':
 *         description: Dados de ocorrências por tipo.
 *
 * /api/v3/dashboard/ocorrencias-por-bairro:
 *   get:
 *     summary: Obtém o top 10 de ocorrências por bairro
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/dataInicio'
 *       - $ref: '#/components/parameters/dataFim'
 *       - $ref: '#/components/parameters/subgrupoId'
 *     responses:
 *       '200':
 *         description: Dados de ocorrências por bairro.
 *
 * /api/v3/dashboard/ocorrencias-por-municipio:
 *   get:
 *     summary: (NOVO) Obtém ocorrências por município (Gráfico Pizza)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/dataInicio'
 *       - $ref: '#/components/parameters/dataFim'
 *       - $ref: '#/components/parameters/subgrupoId'
 *     responses:
 *       '200':
 *         description: Dados de ocorrências por município.
 *
 * /api/v3/dashboard/ocorrencias-por-periodo:
 *   get:
 *     summary: (NOVO) Obtém total de ocorrências por período (Gráfico Linha)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: periodo
 *         schema:
 *           type: string
 *           enum: [day, month]
 *         description: Agrupar por 'day' (dia) ou 'month' (mês). Padrão é 'day'.
 *       - $ref: '#/components/parameters/dataInicio'
 *       - $ref: '#/components/parameters/dataFim'
 *       - $ref: '#/components/parameters/status'
 *       - $ref: '#/components/parameters/bairroId'
 *       - $ref: '#/components/parameters/subgrupoId'
 *     responses:
 *       '200':
 *         description: Lista de totais por período.
 *
 * /api/v3/dashboard/avg-completion-time:
 *   get:
 *     summary: (NOVO) Obtém tempo médio (em horas) de conclusão por tipo (Gráfico Barra)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/dataInicio'
 *       - $ref: '#/components/parameters/dataFim'
 *       - $ref: '#/components/parameters/bairroId'
 *       - $ref: '#/components/parameters/subgrupoId'
 *     responses:
 *       '200':
 *         description: Lista de tipos com seu tempo médio de conclusão em horas.
 */

router.use(authenticateToken);

router.get(
  "/ocorrencias-por-status",
  validate(listOcorrenciaSchema),
  getKpiOcorrenciasPorStatus
);
router.get(
  "/ocorrencias-por-tipo",
  validate(listOcorrenciaSchema),
  getKpiOcorrenciasPorTipo
);
router.get(
  "/ocorrencias-por-bairro",
  validate(listOcorrenciaSchema),
  getKpiOcorrenciasPorBairro
);
router.get(
  "/ocorrencias-por-municipio",
  validate(listOcorrenciaSchema),
  getKpiOcorrenciasPorMunicipio
);
router.get(
  "/ocorrencias-por-periodo",
  validate(listOcorrenciaSchema),
  getKpiOcorrenciasPorPeriodo
);
router.get(
  "/avg-completion-time",
  validate(listOcorrenciaSchema),
  getKpiAvgCompletionTime
);

export default router;
