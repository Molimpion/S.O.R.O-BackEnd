// src/controllers/ocorrenciaController.ts (ATUALIZADO COM NOMES PADRONIZADOS)
import 'express-async-errors';
import { Request, Response } from 'express';
import * as ocorrenciaService from '../services/ocorrenciaService';

// Interface para garantir que o req.user exista e tenha os dados do token
interface AuthRequest extends Request {
  user?: { userId: string; profile: string };
}

// ATUALIZADO: Nome da função de 'criar' para 'create'
export const create = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const novaOcorrencia = await ocorrenciaService.createOcorrencia(req.body, userId);
  res.status(201).json(novaOcorrencia);
};

// ATUALIZADO: Nome da função de 'listarTodas' para 'getAll'
export const getAll = async (req: Request, res: Response) => {
  const resultado = await ocorrenciaService.getAllOcorrencias(req.query);
  res.status(200).json(resultado);
};

// Função para buscar uma ocorrência pelo ID
export const getById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const ocorrencia = await ocorrenciaService.getOcorrenciaById(id);
  res.status(200).json(ocorrencia);
};