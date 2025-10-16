// src/controllers/viaturaController.ts

import 'express-async-errors';
import { Request, Response } from 'express';
import * as viaturaService from '../services/viaturaService';
import { NumeroViatura } from '@prisma/client'; // <-- Importe o Enum

export const create = async (req: Request, res: Response) => {
  // ... (código existente)
};

export const getAll = async (req: Request, res: Response) => {
  // ... (código existente)
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  // Converta a string para o tipo do Enum antes de passar para o serviço
  await viaturaService.deleteViatura(id as NumeroViatura); 
  res.status(204).send();
};