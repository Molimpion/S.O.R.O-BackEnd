// src/controllers/ocorrenciaController.ts (COM SOCKET.IO)

import { Request, Response, Express } from 'express';
import * as ocorrenciaService from '../services/ocorrenciaService';
import { BadRequestError } from '../errors/api-errors';

// Interface atualizada para incluir 'file' (para o upload)
interface AuthRequest extends Request {
  user?: { userId: string; profile: string };
  file?: Express.Multer.File;
}

export const create = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const novaOcorrencia = await ocorrenciaService.createOcorrencia(req.body, userId);

  // --- EMITIR SOCKET ---
  // Notifica todos os clientes conectados sobre a nova ocorrência
  const io = req.app.get('io');
  io.emit('nova_ocorrencia', novaOcorrencia); 
  // --- FIM DO SOCKET ---

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
  
  // --- EMITIR SOCKET ---
  // Notifica todos sobre a atualização (ex: mudança de status)
  const io = req.app.get('io');
  io.emit('ocorrencia_atualizada', ocorrenciaAtualizada);
  // --- FIM DO SOCKET ---
  
  res.status(200).json(ocorrenciaAtualizada);
};

// --- FUNÇÃO DE UPLOAD ADICIONADA (das etapas anteriores) ---
/**
 * Handler para fazer upload de um arquivo de mídia para uma ocorrência.
 */
export const uploadMidia = async (req: AuthRequest, res: Response) => {
  const { id } = req.params; // ID da ocorrência
  const userId = req.user!.userId; // ID do usuário (do token)

  if (!req.file) {
    throw new BadRequestError('Nenhum arquivo enviado.');
  }

  const novaMidia = await ocorrenciaService.addMidiaToOcorrencia(
    id,
    userId,
    req.file
  );

  // --- EMITIR SOCKET ---
  // Notifica o frontend que novas mídias foram adicionadas a uma ocorrência
  const io = req.app.get('io');
  // Envia a mídia e também o ID da ocorrência pai
  io.emit('media_adicionada', { ...novaMidia, ocorrenciaId: id }); 
  // --- FIM DO SOCKET ---

  res.status(201).json({ message: 'Mídia enviada com sucesso!', data: novaMidia });
};