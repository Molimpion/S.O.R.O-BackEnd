import 'express-async-errors';
import { Request, Response } from 'express';
import * as naturezaService from '../services/naturezaService';

export const create = async (req: Request, res: Response) => {
  const { descricao } = req.body;
  const novaNatureza = await naturezaService.createNatureza(descricao);
  res.status(201).json(novaNatureza);
};

export const getAll = async (req: Request, res: Response) => {
  const naturezas = await naturezaService.getAllNaturezas();
  res.status(200).json(naturezas);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  await naturezaService.deleteNatureza(id);
  res.status(204).send();
};