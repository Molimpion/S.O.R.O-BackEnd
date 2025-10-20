// src/controllers/naturezaController.ts (FINAL CORREÇÃO - Limpando TipoObsoleto)

import { Request, Response } from 'express';
import { createNatureza, getAllNaturezas, deleteNatureza } from '../services/naturezaService';
// REMOVIDO: import { TipoNatureza } from '@prisma/client'; // <<-- ESTA LINHA CAUSAVA O ERRO

export async function create(req: Request, res: Response) { // Assumindo sintaxe 'async function'
  const { descricao } = req.body;
  // A função createNatureza espera apenas string, resolvendo o problema
  const novaNatureza = await createNatureza(descricao);
  res.status(201).json(novaNatureza);
};

export async function getAll(req: Request, res: Response) { // Assumindo sintaxe 'async function'
  const naturezas = await getAllNaturezas();
  res.status(200).json(naturezas);
};

export async function remove(req: Request, res: Response) { // Assumindo sintaxe 'async function'
  const { id } = req.params;
  await deleteNatureza(id);
  res.status(204).send();
};