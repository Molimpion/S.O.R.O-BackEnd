import 'express-async-errors';
import { Request, Response } from 'express';
import * as grupoService from '../services/grupoService';

export const create = async (req: Request, res: Response) => {
  const novoGrupo = await grupoService.createGrupo(req.body);
  res.status(201).json(novoGrupo);
};

export const getAll = async (req: Request, res: Response) => {
  const grupos = await grupoService.getAllGrupos();
  res.status(200).json(grupos);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  await grupoService.deleteGrupo(id);
  res.status(204).send();
};