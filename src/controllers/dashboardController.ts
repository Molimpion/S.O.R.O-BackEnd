import { Request, Response } from 'express';
import * as dashboardService from '../services/dashboardService';

export const getKpiOcorrenciasPorStatus = async (req: Request, res: Response) => {
  const data = await dashboardService.getOcorrenciasPorStatus(req.query as any);
  res.status(200).json(data);
};

export const getKpiOcorrenciasPorTipo = async (req: Request, res: Response) => {
  const data = await dashboardService.getOcorrenciasPorTipo(req.query as any);
  res.status(200).json(data);
};

export const getKpiOcorrenciasPorBairro = async (req: Request, res: Response) => {
  const data = await dashboardService.getOcorrenciasPorBairro(req.query as any);
  res.status(200).json(data);
};