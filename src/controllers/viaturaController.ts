// src/controllers/viaturaController.ts (CORRIGIDO)

import { Request, Response } from 'express';
// CORREÇÃO: Usando importação nomeada
import { createViatura, getAllViaturas, deleteViatura } from '../services/viaturaService';
import { NumeroViatura } from '@prisma/client';

export const create = async (req: Request, res: Response) => {
  const novaViatura = await createViatura(req.body);
  res.status(201).json(novaViatura);
};

export const getAll = async (req: Request, res: Response) => {
  const viaturas = await getAllViaturas();
  res.status(200).json(viaturas);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  // Remoção do cast e da importação de NumeroViatura, já que id agora é String (PK)
  await deleteViatura(id);
  res.status(204).send();
};