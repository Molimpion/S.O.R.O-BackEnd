// src/controllers/viaturaController.ts (COM SOCKET.IO)

import { Request, Response } from 'express';
import { createViatura, getAllViaturas, deleteViatura, updateViatura } from '../services/viaturaService';

export async function create(req: Request, res: Response) {
  const novaViatura = await createViatura(req.body);

  // --- EMITIR SOCKET ---
  const io = req.app.get('io');
  io.emit('lista_viaturas_atualizada', { action: 'create', data: novaViatura });
  // --- FIM DO SOCKET ---

  res.status(201).json({ message: 'Viatura criada com sucesso!', data: novaViatura });
};

export async function getAll(req: Request, res: Response) {
  const viaturas = await getAllViaturas();
  res.status(200).json(viaturas);
};

export async function update(req: Request, res: Response) {
  const { id } = req.params;
  const updatedViatura = await updateViatura(id, req.body);

  // --- EMITIR SOCKET ---
  const io = req.app.get('io');
  io.emit('lista_viaturas_atualizada', { action: 'update', data: updatedViatura });
  // --- FIM DO SOCKET ---

  res.status(200).json({ message: 'Viatura atualizada com sucesso!', data: updatedViatura });
}

export async function remove(req: Request, res: Response) {
  const { id } = req.params;
  await deleteViatura(id);

  // --- EMITIR SOCKET ---
  const io = req.app.get('io');
  io.emit('lista_viaturas_atualizada', { action: 'delete', data: { id } });
  // --- FIM DO SOCKET ---

  res.status(200).json({ message: 'Viatura deletada com sucesso.' });
};