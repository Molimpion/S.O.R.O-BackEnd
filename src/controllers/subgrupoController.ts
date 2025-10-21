import { Request, Response } from 'express';
import { createSubgrupo, getAllSubgrupos, deleteSubgrupo } from '../services/subgrupoService';

export const create = async (req: Request, res: Response) => {
  const novoSubgrupo = await createSubgrupo(req.body);
  res.status(201).json(novoSubgrupo);
};

export const getAll = async (req: Request, res: Response) => {
  const subgrupos = await getAllSubgrupos();
  res.status(200).json(subgrupos);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  await deleteSubgrupo(id);
  res.status(204).send();
};