import { Router } from 'express';
import * as bairroController from '../controllers/bairroController';
import { authenticateToken, checkAdmin } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { createBairroSchema, putBairroSchema, patchBairroSchema } from '../validators/bairroValidator';

const router = Router();
router.use(authenticateToken, checkAdmin);

/**
 * @swagger
 * /api/bairros:
 *   post:
 *     summary: Cria um novo bairro
 *     tags:
 *       - Admin: Bairros
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Bairro'
 *     responses:
 *       '201':
 *         description: Bairro criado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 data:
 *                   $ref: '#/components/schemas/Bairro'
 *       '404':
 *         description: Município (id_municipio_fk) não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 *       '409':
 *         description: Bairro com este nome já existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error409'
 *   get:
 *     summary: Lista todos os bairros
 *     tags:
 *       - Admin: Bairros
 *     responses:
 *       '200':
 *         description: Lista de bairros (com município aninhado)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Bairro'
 *                   - type: object
 *                     properties:
 *                       municipio:
 *                         $ref: '#/components/schemas/Municipio'
 *                         nullable: true
 */
router.post('/', validate(createBairroSchema), bairroController.create);
router.get('/', bairroController.getAll);

/**
 * @swagger
 * /api/bairros/{id}:
 *   get:
 *     summary: Obtém detalhes de um bairro
 *     tags:
 *       - Admin: Bairros
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string, format: uuid }
 *         required: true
 *         description: ID do bairro
 *     responses:
 *       '200':
 *         description: Detalhes do bairro
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bairro'
 *       '404':
 *         description: Bairro não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 *   put:
 *     summary: (PUT) Substitui os dados de um bairro
 *     tags:
 *       - Admin: Bairros
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string, format: uuid }
 *         required: true
 *         description: ID do bairro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Bairro'
 *     responses:
 *       '200':
 *         description: Bairro atualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 data:
 *                   $ref: '#/components/schemas/Bairro'
 *       '404':
 *         description: Bairro ou Município (id_municipio_fk) não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 *       '409':
 *         description: Conflito (nome já em uso)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error409'
 *   patch:
 *     summary: (PATCH) Atualiza parcialmente um bairro
 *     tags:
 *       - Admin: Bairros
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string, format: uuid }
 *         required: true
 *         description: ID do bairro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome_bairro: { type: string }
 *               id_municipio_fk: { type: string, format: uuid, nullable: true }
 *     responses:
 *       '200':
 *         description: Bairro atualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 data:
 *                   $ref: '#/components/schemas/Bairro'
 *       '404':
 *         description: Bairro ou Município (id_municipio_fk) não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 *       '409':
 *         description: Conflito (nome já em uso)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error409'
 *   delete:
 *     summary: Deleta um bairro
 *     tags:
 *       - Admin: Bairros
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string, format: uuid }
 *         required: true
 *         description: ID do bairro
 *     responses:
 *       '200':
 *         description: Bairro deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessDelete'
 *       '404':
 *         description: Bairro não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 *       '409':
 *         description: Conflito (bairro está associado a ocorrências)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error409'
 */
router.get('/:id', bairroController.getById);
router.put('/:id', validate(putBairroSchema), bairroController.update);
router.patch('/:id', validate(patchBairroSchema), bairroController.update);
router.delete('/:id', bairroController.remove);

export default router;