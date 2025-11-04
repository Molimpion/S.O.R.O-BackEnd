// src/controllers/ocorrenciaController.ts (COM UPLOAD DE MÍDIA)

import { Request, Response } from 'express';
import * as ocorrenciaService from '../services/ocorrenciaService';
import { BadRequestError } from '../errors/api-errors'; // Importa o erro para o upload

// Esta interface é necessária para extrair o 'userId' do token
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

export const update = async (req: AuthRequest, res: Response) => { 
  const { id } = req.params; 
  const data = req.body; 
  const userId = req.user!.userId; 

  const ocorrenciaAtualizada = await ocorrenciaService.updateOcorrencia(
    id,
    data,
    userId 
  );
  
  res.status(200).json(ocorrenciaAtualizada);
};

// --- FUNÇÃO DE UPLOAD ADICIONADA ---
/**
 * Handler para fazer upload de um arquivo de mídia para uma ocorrência.
 */
export const uploadMidia = async (req: AuthRequest, res: Response) => {
  const { id } = req.params; // ID da ocorrência
  const userId = req.user!.userId; // ID do usuário (do token)

  // 1. Verifica se o arquivo foi enviado (o multer coloca em req.file)
  if (!req.file) {
    throw new BadRequestError('Nenhum arquivo enviado.');
  }

  // 2. Chama o serviço para salvar a URL no banco de dados
  // (A função 'addMidiaToOcorrencia' está no ocorrenciaService.ts)
  const novaMidia = await ocorrenciaService.addMidiaToOcorrencia(
    id,
    userId,
    req.file
  );

  res.status(201).json({ message: 'Mídia enviada com sucesso!', data: novaMidia });
};
// --- FIM DA FUNÇÃO ADICIONADA ---