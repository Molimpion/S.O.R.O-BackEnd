// src/controllers/formaAcervoController.ts (CORRIGIDO)

import { Request, Response } from 'express';
// CORREÇÃO: Usando importação nomeada
import { createFormaAcervo, getAllFormasAcervo, deleteFormaAcervo } from '../services/formaAcervoService'; 

export const create = async (req: Request, res: Response) => {
  const { descricao } = req.body;
  const novaFormaAcervo = await createFormaAcervo(descricao);
  res.status(201).json(novaFormaAcervo);
};

export const getAll = async (req: Request, res: Response) => {
  const formasAcervo = await getAllFormasAcervo();
  res.status(200).json(formasAcervo);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  await deleteFormaAcervo(id);
  res.status(204).send();
};