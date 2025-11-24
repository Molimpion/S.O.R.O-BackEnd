import { Request, Response, Express } from "express";
import * as ocorrenciaService from "../services/ocorrenciaService";
import { BadRequestError } from "../errors/api-errors";

interface AuthRequest extends Request {
  user?: { userId: string; profile: string };
  file?: Express.Multer.File;
}

export const create = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const novaOcorrencia = await ocorrenciaService.createOcorrencia(
    req.body,
    userId
  );

  const io = req.app.get("io");
  io.emit("nova_ocorrencia", novaOcorrencia);

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

  const io = req.app.get("io");
  io.emit("ocorrencia_atualizada", ocorrenciaAtualizada);

  res.status(200).json(ocorrenciaAtualizada);
};

/**
 * Handler para fazer upload de um arquivo de mídia para uma ocorrência.
 */
export const uploadMidia = async (req: AuthRequest, res: Response) => {
  const { id } = req.params; //
  const userId = req.user!.userId;

  if (!req.file) {
    throw new BadRequestError("Nenhum arquivo enviado.");
  }

  const novaMidia = await ocorrenciaService.addMidiaToOcorrencia(
    id,
    userId,
    req.file
  );

  const io = req.app.get("io");

  io.emit("media_adicionada", { ...novaMidia, ocorrenciaId: id });

  res
    .status(201)
    .json({ message: "Mídia enviada com sucesso!", data: novaMidia });
};
