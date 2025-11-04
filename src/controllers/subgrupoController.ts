// src/controllers/subgrupoController.ts (COM SOCKET.IO)

import { Request, Response } from 'express';
import { createSubgrupo, getAllSubgrupos, deleteSubgrupo } from '../services/subgrupoService';

export const create = async (req: Request, res: Response) => {
  const novoSubgrupo = await createSubgrupo(req.body);

  // --- EMITIR SOCKET ---
  const io = req.app.get('io');
  io.emit('lista_subgrupos_atualizada', { action: 'create', data: novoSubgrupo });
  // --- FIM DO SOCKET ---

  res.status(201).json({ message: 'Subgrupo criado com sucesso!', data: novoSubgrupo });
};

export const getAll = async (req: Request, res: Response) => {
  const subgrupos = await getAllSubgrupos();
  res.status(200).json(subgrupos);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  await deleteSubgrupo(id);

  // --- EMITIR SOCKET ---
  const io = req.app.get('io');
  io.emit('lista_subgrupos_atualizada', { action: 'delete', data: { id } });
  // --- FIM DO SOCKET ---

  res.status(200).json({ message: 'Subgrupo deletado com sucesso.' });
};