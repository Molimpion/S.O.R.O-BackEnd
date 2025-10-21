import { Request, Response } from 'express';
import { createUnidade, getAllUnidades, deleteUnidade } from '../services/unidadeOperacionalService';

export const create = async (req: Request, res: Response) => {
  const novaUnidade = await createUnidade(req.body);
  res.status(201).json(novaUnidade);
};

export const getAll = async (req: Request, res: Response) => {
  const unidades = await getAllUnidades();
  res.status(200).json(unidades);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  await deleteUnidade(id);
  res.status(204).send();
};