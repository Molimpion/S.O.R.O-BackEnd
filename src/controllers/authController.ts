// src/controllers/authController.ts

import { Request, Response } from 'express';
// Importa todos os exports do nosso serviço de autenticação
import * as authService from '../services/authService';

// --- CONTROLADOR DE CADASTRO ---
export const register = async (req: Request, res: Response) => {
  // Usamos um bloco try...catch para lidar com possíveis erros
  try {
    // 1. Pega os dados do corpo da requisição (o JSON enviado pelo cliente)
    const userData = req.body;

    // 2. Chama a função registerUser do nosso serviço para fazer o trabalho pesado
    const user = await authService.registerUser(userData);

    // 3. Se tudo deu certo, envia uma resposta de sucesso (status 201 - Created)
    res.status(201).json({ message: 'Usuário criado com sucesso!', data: user });

  } catch (error: any) {
    // 4. Se o serviço lançou um erro, envia uma resposta de erro (status 400 - Bad Request)
    res.status(400).json({ error: error.message });
  }
};

// --- CONTROLADOR DE LOGIN ---
export const login = async (req: Request, res: Response) => {
  try {
    // 1. Pega os dados do corpo da requisição
    const loginData = req.body;

    // 2. Chama a função loginUser do nosso serviço
    const { user, token } = await authService.loginUser(loginData);

    // 3. Se o login for bem-sucedido, envia a resposta com o token (status 200 - OK)
    res.status(200).json({
      message: 'Login bem-sucedido!',
      token,
      user,
    });

  } catch (error: any) {
    // 4. Se o serviço lançou um erro (email/senha errados), envia uma resposta de não autorizado (status 401 - Unauthorized)
    res.status(401).json({ error: error.message });
  }
};