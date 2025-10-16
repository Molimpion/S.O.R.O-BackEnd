// src/controllers/dashboardController.ts
import 'express-async-errors';
import { Request, Response } from 'express';
import * as dashboardService from '../services/dashboardService';

export const getKpiOcorrenciasPorStatus = async (req: Request, res: Response) => {
  const data = await dashboardService.getOcorrenciasPorStatus();
  res.status(200).json(data);
};

export const getKpiOcorrenciasPorTipo = async (req: Request, res: Response) => {
  const data = await dashboardService.getOcorrenciasPorTipo();
  res.status(200).json(data);
};

export const getKpiOcorrenciasPorBairro = async (req: Request, res: Response) => {
  const data = await dashboardService.getOcorrenciasPorBairro();
  res.status(200).json(data);
};