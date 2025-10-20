// src/controllers/viaturaController.ts (LIMPO E FINALIZADO)

import { Request, Response } from 'express';
// CORREÇÃO: Usando importação nomeada
import { createViatura, getAllViaturas, deleteViatura } from '../services/viaturaService';
// REMOVIDO: import { NumeroViatura } from '@prisma/client'; // Não é mais necessário

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
  // Agora usa o ID (string) que é o novo PK UUID
  await deleteViatura(id);
  res.status(204).send();
};