import { Request, Response } from 'express';
import * as unidadeService from '../services/unidadeOperacionalService';

export const create = async (req: Request, res: Response) => {
  const novaUnidade = await unidadeService.createUnidade(req.body);
  res.status(201).json(novaUnidade);
};

export const getAll = async (req: Request, res: Response) => {
  const unidades = await unidadeService.getAllUnidades();
  res.status(200).json(unidades);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  await unidadeService.deleteUnidade(id);
  res.status(204).send();
};