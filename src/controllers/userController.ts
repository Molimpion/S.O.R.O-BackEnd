// src/controllers/userController.ts (COM SOCKET.IO)

import { Request, Response } from 'express';
import * as userService from '../services/userService';

interface AuthRequest extends Request {
  user?: { userId: string; profile: string };
}

export const getAll = async (req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  res.status(200).json(users);
};

export const getById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await userService.getUserById(id);
  res.status(200).json(user);
};

export const update = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const adminUserId = req.user!.userId;
  const updatedUser = await userService.updateUser(id, data, adminUserId);

  // --- EMITIR SOCKET ---
  const io = req.app.get('io');
  io.emit('lista_usuarios_atualizada', { action: 'update', data: updatedUser });
  // --- FIM DO SOCKET ---

  res.status(200).json(updatedUser);
};

export const remove = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const adminUserId = req.user!.userId;
  await userService.deleteUser(id, adminUserId);

  // --- EMITIR SOCKET ---
  const io = req.app.get('io');
  io.emit('lista_usuarios_atualizada', { action: 'delete', data: { id } });
  // --- FIM DO SOCKET ---

  res.status(204).send();
};