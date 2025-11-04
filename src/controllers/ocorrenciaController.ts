// src/controllers/ocorrenciaController.ts (CORRIGIDO)

// --- 1. IMPORTAR 'Express' PARA OS TIPOS ---
import { Request, Response, Express } from 'express'; 
import * as ocorrenciaService from '../services/ocorrenciaService';
import { BadRequestError } from '../errors/api-errors'; 

// --- 2. ATUALIZAR INTERFACE ---
interface AuthRequest extends Request {
  user?: { userId: string; profile: string };
  file?: Express.Multer.File; // <-- Propriedade 'file' adicionada
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

// --- FUNÇÃO DE UPLOAD (agora válida) ---
export const uploadMidia = async (req: AuthRequest, res: Response) => {
  const { id } = req.params; 
  const userId = req.user!.userId; 

  // Esta verificação agora é válida
  if (!req.file) {
    throw new BadRequestError('Nenhum arquivo enviado.');
  }

  // Esta chamada agora é válida
  const novaMidia = await ocorrenciaService.addMidiaToOcorrencia(
    id,
    userId,
    req.file
  );

  res.status(201).json({ message: 'Mídia enviada com sucesso!', data: novaMidia });
};