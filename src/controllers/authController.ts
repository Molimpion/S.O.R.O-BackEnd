// src/controllers/authController.ts (LIMPO)

// REMOVIDO: import 'express-async-errors' // Redundante, centralizado em index.ts
import { Request, Response } from 'express';
import * as authService from '../services/authService';

export const register = async (req: Request, res: Response) => {
  const userData = req.body;
  const user = await authService.registerUser(userData);
  res.status(201).json({ message: 'Usuário criado com sucesso!', data: user });
};

export const login = async (req: Request, res: Response) => {
  const loginData = req.body;
  const { user, token } = await authService.loginUser(loginData);
  res.status(200).json({
    message: 'Login bem-sucedido!',
    token,
    user,
  });
};