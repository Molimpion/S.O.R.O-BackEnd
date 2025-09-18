// src/controllers/userController.ts (AJUSTE FINAL)

import { Request, Response } from 'express';
import * as userService from '../services/userService';

// Interface para garantir que req.user exista e tenha os dados do token
interface AuthRequest extends Request {
  user?: { userId: string; profile: string };
}

// ... (as funções getAll e getById continuam iguais) ...
export const getAll = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    res.status(200).json(user);
  } catch (error: any) {
    if (error.message === 'Usuário não encontrado') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

// Controlador para atualizar um usuário (ATUALIZADO)
export const update = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const adminUserId = req.user!.userId; // Pega o ID do admin logado a partir do token!
    
    const updatedUser = await userService.updateUser(id, data, adminUserId);
    res.status(200).json(updatedUser);
  } catch (error: any) {
    if (error.message === 'Usuário não encontrado') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

// Controlador para deletar um usuário (ATUALIZADO)
export const remove = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const adminUserId = req.user!.userId; // Pega o ID do admin logado a partir do token!

    await userService.deleteUser(id, adminUserId);
    res.status(204).send();
  } catch (error: any) {
    if (error.message.includes('não encontrado')) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};