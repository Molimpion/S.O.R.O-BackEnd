// src/controllers/userController.ts

import { Request, Response } from 'express';
import * as userService from '../services/userService';

// Controlador para listar todos os usuários
export const getAll = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Controlador para buscar um usuário pelo ID
export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // O ID virá da URL (ex: /api/users/123)
    const user = await userService.getUserById(id);
    res.status(200).json(user);
  } catch (error: any) {
    // Se o serviço lançar um erro de "não encontrado", retorna 404
    if (error.message === 'Usuário não encontrado') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

// Controlador para atualizar um usuário
export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedUser = await userService.updateUser(id, data);
    res.status(200).json(updatedUser);
  } catch (error: any) {
    if (error.message === 'Usuário não encontrado') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

// Controlador para deletar um usuário
export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await userService.deleteUser(id);
    // Retorna uma resposta vazia com status 204 (No Content) para indicar sucesso
    res.status(204).send();
  } catch (error: any) {
    if (error.message === 'Usuário não encontrado') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};