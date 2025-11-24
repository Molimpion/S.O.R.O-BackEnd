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

// ======================================================
// ==== NOVAS FUNÇÕES (FASE 3) ====
// ======================================================

export const getKpiOcorrenciasPorMunicipio = async (req: Request, res: Response) => {
  const data = await dashboardService.getOcorrenciasPorMunicipio(req.query as any);
  res.status(200).json(data);
};

export const getKpiOcorrenciasPorPeriodo = async (req: Request, res: Response) => {
  const data = await dashboardService.getOcorrenciasPorPeriodo(req.query as any);
  res.status(200).json(data);
};

export const getKpiAvgCompletionTime = async (req: Request, res: Response) => {
  const data = await dashboardService.getAvgCompletionTimePorTipo(req.query as any);
  res.status(200).json(data);
};