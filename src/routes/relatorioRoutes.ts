import { Router } from 'express';
import { exportRelatorio } from '../controllers/relatorioController';
import { authenticateAdmin } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { reportOcorrenciaSchema } from '../validators/ocorrenciaValidator';

const router = Router();

// ======================================================
// ==== ANOTAÇÕES SWAGGER (JSDoc) - RELATÓRIOS ====
// ======================================================

/**
 * @swagger
 * tags:
 *   - name: "Admin: Relatórios"
 *     description: (Admin) Endpoints para exportação de relatórios.
 * /api/v1/relatorios:
 *   get:
 *     summary: Exporta um relatório de ocorrências em formato Excel (apenas Admin)
 *     tags: ["Admin: Relatórios"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: ano
 *         schema:
 *           type: integer
 *         description: Ano para filtrar (opcional)
 *       - in: query
 *         name: mes
 *         schema:
 *           type: integer
 *         description: Mês para filtrar (opcional)
 *       - in: query
 *         name: unidadeOperacionalId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da Unidade Operacional para filtrar (opcional)
 *     responses:
 *       200:
 *         description: Relatório gerado com sucesso. Retorna um ficheiro binário (Excel).
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Erro de validação.
 *       403:
 *         description: Acesso negado (não é Admin).
 */

router.use(authenticateAdmin);

router.get('/', validate(reportOcorrenciaSchema), exportRelatorio);

export default router;
