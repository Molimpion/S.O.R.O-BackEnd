// src/controllers/viaturaController.ts (FINAL)

import { Request, Response } from 'express';
// Correção: Importação nomeada
import { createViatura, getAllViaturas, deleteViatura } from '../services/viaturaService';
// Removido: import { NumeroViatura } from '@prisma/client';

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
  // O deleteViatura agora espera o ID (string) do novo PK
  await deleteViatura(id);
  res.status(204).send();
};