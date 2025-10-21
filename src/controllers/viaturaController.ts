import { Request, Response } from 'express';
import { createViatura, getAllViaturas, deleteViatura } from '../services/viaturaService';

export async function create(req: Request, res: Response) {
  const novaViatura = await createViatura(req.body);
  res.status(201).json(novaViatura);
};

export async function getAll(req: Request, res: Response) {
  const viaturas = await getAllViaturas();
  res.status(200).json(viaturas);
};

export async function remove(req: Request, res: Response) {
  const { id } = req.params;
  await deleteViatura(id);
  res.status(204).send();
};