import 'express-async-errors';
import { Request, Response } from 'express';
import * as ocorrenciaService from '../services/ocorrenciaService';

export const exportCsv = async (req: Request, res: Response) => {
  const filters = req.query;
  const csvString = await ocorrenciaService.exportOcorrenciasToCSV(filters as any);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=relatorio_ocorrencias.csv');

  res.status(200).send(csvString);
};

export const exportPdf = async (req: Request, res: Response) => {
  const filters = req.query;
  const pdfBuffer = await ocorrenciaService.exportOcorrenciasToPDF(filters as any);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=relatorio_ocorrencias.pdf');

  res.status(200).send(pdfBuffer);
};