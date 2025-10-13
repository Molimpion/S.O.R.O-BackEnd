// src/controllers/ocorrenciaController.ts (ATUALIZADO COM FILTROS)
import 'express-async-errors';
import { Request, Response } from 'express';
import * as ocorrenciaService from '../services/ocorrenciaService';

// Interface para garantir que o req.user exista e tenha os dados do token
interface AuthRequest extends Request {
  user?: { userId: string; profile: string };
}

export const criar = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const novaOcorrencia = await ocorrenciaService.createOcorrencia(req.body, userId);
  res.status(201).json(novaOcorrencia);
};

// FUNÇÃO ATUALIZADA para lidar com filtros e paginação
export const listarTodas = async (req: Request, res: Response) => {
  // Os filtros agora vêm da query string da URL (ex: ?status=ABERTA)
  // e são repassados para a função de serviço.
  const resultado = await ocorrenciaService.getAllOcorrencias(req.query);
  res.status(200).json(resultado);
};

// Função para buscar uma ocorrência pelo ID
export const getById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const ocorrencia = await ocorrenciaService.getOcorrenciaById(id);
  res.status(200).json(ocorrencia);
};