import 'express-async-errors';
import { Request, Response } from 'express';
import * as ocorrenciaService from '../services/ocorrenciaService';

export const exportOcorrenciasCSV = async (req: Request, res: Response) => {
  // Os filtros vêm da query string da URL, assim como na listagem
  const filters = req.query;

  const csvString = await ocorrenciaService.exportOcorrenciasToCSV(filters as any);

  // Configura os cabeçalhos da resposta para indicar que é um ficheiro CSV
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=relatorio_ocorrencias.csv');

  // Envia a string CSV como resposta
  res.status(200).send(csvString);
};

export const exportOcorrenciasPDF = async (req: Request, res: Response) => {
  const filters = req.query;
  const pdfBuffer = await ocorrenciaService.exportOcorrenciasToPDF(filters as any);

  // Configura os cabeçalhos para indicar que é um ficheiro PDF
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=relatorio_ocorrencias.pdf');

  // Envia o buffer do PDF como resposta
  res.status(200).send(pdfBuffer);
};