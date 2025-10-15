import 'express-async-errors';
import { Request, Response } from 'express';
import * as grupamentoService from '../services/grupamentoService';

export const create = async (req: Request, res: Response) => {
  const novoGrupamento = await grupamentoService.createGrupamento(req.body);
  res.status(201).json(novoGrupamento);
};

export const getAll = async (req: Request, res: Response) => {
  const grupamentos = await grupamentoService.getAllGrupamentos();
  res.status(200).json(grupamentos);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  await grupamentoService.deleteGrupamento(id);
  res.status(204).send();
};
