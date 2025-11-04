import { Request, Response, Express } from 'express'; // Importa Express
import * as ocorrenciaService from '../services/ocorrenciaService';
import { BadRequestError } from '../errors/api-errors'; 

// Atualiza a interface
interface AuthRequest extends Request {
  user?: { userId: string; profile: string };
  file?: Express.Multer.File; // Adiciona a propriedade 'file'
}

// ... (create, getAll, getById - sem mudanças) ...
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


// Função de Upload (agora correta)
export const uploadMidia = async (req: AuthRequest, res: Response) => {
  const { id } = req.params; 
  const userId = req.user!.userId; 

  if (!req.file) { // Agora req.file é reconhecido
    throw new BadRequestError('Nenhum arquivo enviado.');
  }

  const novaMidia = await ocorrenciaService.addMidiaToOcorrencia(
    id,
    userId,
    req.file
  );

  res.status(201).json({ message: 'Mídia enviada com sucesso!', data: novaMidia });
};