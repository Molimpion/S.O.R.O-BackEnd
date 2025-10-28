// src/controllers/ocorrenciaController.ts (COM UPDATE CORRIGIDO)

import { Request, Response } from 'express';
import * as ocorrenciaService from '../services/ocorrenciaService';

// Esta interface já existe no seu arquivo e é essencial
interface AuthRequest extends Request {
  user?: { userId: string; profile: string };
}

export const create = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const novaOcorrencia = await ocorrenciaService.createOcorrencia(req.body, userId);
  res.status(201).json(novaOcorrencia);
};

export const getAll = async (req: Request, res: Response) => {
  const resultado = await ocorrenciaService.getAllOcorrencias(req.query);
  res.status(200).json(resultado);
};

export const getById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const ocorrencia = await ocorrenciaService.getOcorrenciaById(id);
  res.status(200).json(ocorrencia);
};

// --- ALTERAÇÃO (PASSO 3 CORRIGIDO) ---
/**
 * Handler para atualizar uma ocorrência.
 * Pega os dados da requisição e o ID do usuário logado
 * e os repassa para o serviço de ocorrência.
 */
export const update = async (req: AuthRequest, res: Response) => { // <-- 1. Usa AuthRequest
  // O ID vem dos parâmetros da URL
  const { id } = req.params; 
  
  // Os dados vêm do corpo da requisição
  const data = req.body; 
  
  // 2. (CORREÇÃO) O ID do usuário vem do token JWT
  //
  const userId = req.user!.userId; 

  // 3. (CORREÇÃO) Chama o serviço com os 3 argumentos obrigatórios
  const ocorrenciaAtualizada = await ocorrenciaService.updateOcorrencia(
    id,
    data,
    userId // <-- 4. Passa o userId para o serviço (Passo 2)
  );
  
  res.status(200).json(ocorrenciaAtualizada);
};
// --- FIM DA ALTERAÇÃO ---