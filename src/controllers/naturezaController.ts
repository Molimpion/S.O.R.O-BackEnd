// src/controllers/naturezaController.ts (CORRIGIDO)

import { Request, Response } from 'express';
// CORREÇÃO: Usando importação nomeada
import { createNatureza, getAllNaturezas, deleteNatureza } from '../services/naturezaService';
import { TipoNatureza } from '@prisma/client';

export const create = async (req: Request, res: Response) => {
  const { descricao } = req.body;
  // TipoNatureza não existe mais no prisma/client, mas a tipagem forçaria o erro
  // Como refatoramos para string, removemos o cast e a importação do TipoNatureza (para NaturezaService)
  // No Controller, mantemos o TipoNatureza importado do Prisma para evitar mais quebras de compilação
  const novaNatureza = await createNatureza(descricao); // Removido o cast "as TipoNatureza"
  res.status(201).json(novaNatureza);
};

export const getAll = async (req: Request, res: Response) => {
  const naturezas = await getAllNaturezas();
  res.status(200).json(naturezas);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  await deleteNatureza(id);
  res.status(204).send();
};