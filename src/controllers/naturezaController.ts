// src/controllers/naturezaController.ts

import 'express-async-errors';
import { Request, Response } from 'express';
import * as naturezaService from '../services/naturezaService';
import { TipoNatureza } from '@prisma/client'; // <-- Importe o Enum

export const create = async (req: Request, res: Response) => {
  const { descricao } = req.body;
  // Converte explicitamente para o tipo do Enum
  const novaNatureza = await naturezaService.createNatureza(descricao as TipoNatureza);
  res.status(201).json(novaNatureza);
};

export const getAll = async (req: Request, res: Response) => {
    // ... (código existente)
};

export const remove = async (req: Request, res: Response) => {
    // ... (código existente)
};