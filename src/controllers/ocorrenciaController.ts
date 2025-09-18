// src/controllers/ocorrenciaController.ts
import { Request, Response } from 'express';
import * as ocorrenciaService from '../services/ocorrenciaService';

export const listarTodas = async (req: Request, res: Response) => {
  try {
    const ocorrencias = await ocorrenciaService.getAllOcorrencias();
    res.status(200).json(ocorrencias);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const criar = async (req: Request, res: Response) => {
  try {
    const novaOcorrencia = await ocorrenciaService.createOcorrencia(req.body);
    res.status(201).json(novaOcorrencia);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};