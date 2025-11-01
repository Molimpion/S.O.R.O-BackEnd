import { Router } from 'express';
import * as formaAcervoController from '../controllers/formaAcervoController';
import { authenticateToken, checkAdmin } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { formaAcervoSchema } from '../validators/formaAcervoValidator';

const router = Router();
router.use(authenticateToken, checkAdmin); // Requer Admin

/**
 * @swagger
 * /api/formas-acervo:
 *   post:
 *     summary: Cria uma nova Forma de Acervo
 *     tags: [Admin: Formas de Acervo]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FormaAcervo'
 *     responses:
 *       '201':
 *         description: Forma de acervo criada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/FormaAcervo'
 *       '409':
 *         description: Descrição já existe (se for unique)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error409'
 *   get:
 *     summary: Lista todas as Formas de Acervo
 *     tags: [Admin: Formas de Acervo]
 *     responses:
 *       '200':
 *         description: Lista de formas de acervo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FormaAcervo'
 */
router.post('/', validate(formaAcervoSchema), formaAcervoController.create);
router.get('/', formaAcervoController.getAll);

/**
 * @swagger
 * /api/formas-acervo/{id}:
 *   delete:
 *     summary: Deleta uma Forma de Acervo
 *     tags: [Admin: Formas de Acervo]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID da forma de acervo
 *     responses:
 *       '200':
 *         description: Forma de acervo deletada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessDelete'
 *       '404':
 *         description: Forma de acervo não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 *       '409':
 *         description: Conflito (forma de acervo está associada a ocorrências)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error409'
 */
router.delete('/:id', formaAcervoController.remove);

export default router;