import { Request, Response } from 'express';
import * as viaturaService from '../services/viaturaService';
import { NumeroViatura } from '@prisma/client';

export const create = async (req: Request, res: Response) => {
  const novaViatura = await viaturaService.createViatura(req.body);
  res.status(201).json(novaViatura);
};

export const getAll = async (req: Request, res: Response) => {
  const viaturas = await viaturaService.getAllViaturas();
  res.status(200).json(viaturas);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  await viaturaService.deleteViatura(id as NumeroViatura);
  res.status(204).send();
};