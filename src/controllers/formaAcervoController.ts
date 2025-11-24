// src/controllers/formaAcervoController.ts (COM SOCKET.IO)

import { Request, Response } from 'express';
import { createFormaAcervo, getAllFormasAcervo, deleteFormaAcervo } from '../services/formaAcervoService'; 

export const create = async (req: Request, res: Response) => {
  const { descricao } = req.body;
  const novaFormaAcervo = await createFormaAcervo(descricao);

  // --- EMITIR SOCKET ---
  const io = req.app.get('io');
  io.emit('lista_formasacervo_atualizada', { action: 'create', data: novaFormaAcervo });
  // --- FIM DO SOCKET ---

  res.status(201).json({ message: 'Forma de acervo criada com sucesso!', data: novaFormaAcervo });
};

export const getAll = async (req: Request, res: Response) => {
  const formasAcervo = await getAllFormasAcervo();
  res.status(200).json(formasAcervo);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  await deleteFormaAcervo(id);

  // --- EMITIR SOCKET ---
  const io = req.app.get('io');
  io.emit('lista_formasacervo_atualizada', { action: 'delete', data: { id } });
  // --- FIM DO SOCKET ---

  res.status(200).json({ message: 'Forma de acervo deletada com sucesso.' });
};