// src/controllers/unidadeOperacionalController.ts (COM SOCKET.IO)

import { Request, Response } from 'express';
import { createUnidade, getAllUnidades, deleteUnidade } from '../services/unidadeOperacionalService';

export const create = async (req: Request, res: Response) => {
  const novaUnidade = await createUnidade(req.body);

  // --- EMITIR SOCKET ---
  const io = req.app.get('io');
  io.emit('lista_unidades_atualizada', { action: 'create', data: novaUnidade });
  // --- FIM DO SOCKET ---

  res.status(201).json({ message: 'Unidade Operacional criada com sucesso!', data: novaUnidade });
};

export const getAll = async (req: Request, res: Response) => {
  const unidades = await getAllUnidades();
  res.status(200).json(unidades);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  await deleteUnidade(id);

  // --- EMITIR SOCKET ---
  const io = req.app.get('io');
  io.emit('lista_unidades_atualizada', { action: 'delete', data: { id } });
  // --- FIM DO SOCKET ---

  res.status(200).json({ message: 'Unidade Operacional deletada com sucesso.' });
};