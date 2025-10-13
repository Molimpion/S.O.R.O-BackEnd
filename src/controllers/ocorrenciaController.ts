// src/controllers/ocorrenciaController.ts (PREENCHIDO COM BOAS PRÁTICAS)
import 'express-async-errors';
import { Request, Response } from 'express';
import * as ocorrenciaService from '../services/ocorrenciaService';

// Interface para garantir que o req.user exista e tenha os dados do token
interface AuthRequest extends Request {
  user?: { userId: string; profile: string };
}

export const criar = async (req: AuthRequest, res: Response) => {
  // Extraímos o ID do usuário do token, garantindo a segurança
  const userId = req.user!.userId;
  
  const novaOcorrencia = await ocorrenciaService.createOcorrencia(req.body, userId);
  
  res.status(201).json(novaOcorrencia);
};

export const listarTodas = async (req: Request, res: Response) => {
  const ocorrencias = await ocorrenciaService.getAllOcorrencias();
  res.status(200).json(ocorrencias);
};