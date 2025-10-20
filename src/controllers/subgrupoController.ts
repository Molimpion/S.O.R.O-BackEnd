import { Request, Response } from 'express';
import * as subgrupoService from '../services/subgrupoService';

export const create = async (req: Request, res: Response) => {
  const novoSubgrupo = await subgrupoService.createSubgrupo(req.body);
  res.status(201).json(novoSubgrupo);
};

export const getAll = async (req: Request, res: Response) => {
  const subgrupos = await subgrupoService.getAllSubgrupos();
  res.status(200).json(subgrupos);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  await subgrupoService.deleteSubgrupo(id);
  res.status(204).send();
};