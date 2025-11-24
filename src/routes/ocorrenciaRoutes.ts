// src/routes/ocorrenciaRoutes.ts

import { Router } from 'express';
import { create, getAll, getById, update, uploadMidia } from '../controllers/ocorrenciaController';
import { authenticateToken } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import {
  createOcorrenciaSchema,
  listOcorrenciaSchema,
  putOcorrenciaSchema
} from '../validators/ocorrenciaValidator';
import upload from '../configs/upload';

const router = Router();

// ======================================================
// ==== ANOTAÇÕES SWAGGER (JSDoc) - OCORRÊNCIAS ====
// ======================================================

/**
 * @swagger
 * tags:
 *   - name: Ocorrências
 *     description: Endpoints para gerenciar as ocorrências.
 *
 * paths:
 *   /api/v1/ocorrencias:
 *     post:
 *       summary: Cria uma nova ocorrência
 *       tags: [Ocorrências]
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OcorrenciaInput'
 *       responses:
 *         '201':
 *           description: Ocorrência criada com sucesso.
 *         '400':
 *           description: Erro de validação.
 *         '401':
 *           description: Não autorizado.
 *
 *     get:
 *       summary: Lista todas as ocorrências com filtros opcionais
 *       tags: [Ocorrências]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: query
 *           name: status
 *           schema:
 *             type: string
 *             enum: [PENDENTE, EM_ANDAMENTO, CONCLUIDO, CANCELADO]
 *           description: Filtrar por status (opcional)
 *         - in: query
 *           name: subgrupoId
 *           schema:
 *             type: string
 *             format: uuid
 *           description: Filtrar por Subgrupo (opcional)
 *         - in: query
 *           name: bairroId
 *           schema:
 *             type: string
 *             format: uuid
 *           description: Filtrar por Bairro (opcional)
 *         - in: query
 *           name: page
 *           schema:
 *             type: integer
 *           description: Número da página (opcional, padrão 1)
 *         - in: query
 *           name: limit
 *           schema:
 *             type: integer
 *           description: Número máximo de itens por página (opcional, padrão 10)
 *       responses:
 *         '200':
 *           description: Lista de ocorrências.
 *         '401':
 *           description: Não autorizado.
 *
 *   /api/v1/ocorrencias/{id}:
 *     get:
 *       summary: Obtém uma ocorrência pelo ID
 *       tags: [Ocorrências]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *             format: uuid
 *           description: ID da ocorrência
 *       responses:
 *         '200':
 *           description: Detalhes da ocorrência.
 *         '404':
 *           description: Ocorrência não encontrada.
 *
 *     put:
 *       summary: Atualiza uma ocorrência pelo ID (apenas o criador)
 *       tags: [Ocorrências]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *             format: uuid
 *           description: ID da ocorrência
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_situacao:
 *                   type: string
 *                   enum: [PENDENTE, EM_ANDAMENTO, CONCLUIDO, CANCELADO]
 *                 data_execucao_servico:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                 relacionado_eleicao:
 *                   type: boolean
 *                 nr_aviso:
 *                   type: string
 *                   nullable: true
 *       responses:
 *         '200':
 *           description: Ocorrência atualizada com sucesso.
 *         '400':
 *           description: Erro de validação.
 *         '403':
 *           description: Acesso negado (não é o criador).
 *         '404':
 *           description: Ocorrência não encontrada.
 *
 *   /api/v1/ocorrencias/{id}/midia:
 *     post:
 *       summary: Faz upload de uma nova mídia (imagem/vídeo) para uma ocorrência
 *       tags: [Ocorrências]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *             format: uuid
 *           description: ID da ocorrência
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 midia:
 *                   type: string
 *                   format: binary
 *                   description: O arquivo de mídia (imagem ou vídeo)
 *       responses:
 *         '201':
 *           description: Mídia enviada com sucesso.
 *         '400':
 *           description: Erro de validação ou nenhum arquivo enviado.
 *         '404':
 *           description: Ocorrência não encontrada.
 */

// ======================================================
// ==== ROTAS PROTEGIDAS ====
// ======================================================

router.use(authenticateToken);

router.get('/', validate(listOcorrenciaSchema), getAll);
router.get('/:id', getById);
router.post('/', validate(createOcorrenciaSchema), create);
router.put('/:id', validate(putOcorrenciaSchema), update);

// Upload de mídia
router.post('/:id/midia', upload.single('midia'), uploadMidia);

export default router;