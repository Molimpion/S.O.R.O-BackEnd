import { Request, Response } from 'express';
import * as ocorrenciaService from '../services/ocorrenciaService';
import { BadRequestError } from '../errors/api-errors';

export const exportRelatorio = async (req: Request, res: Response) => {
  const { type, ...filters } = req.query as any;

  const ocorrencias = await ocorrenciaService.getOcorrenciasForExport(filters);
  
  if (type === 'csv') {
    const csvString = await ocorrenciaService.exportOcorrenciasToCSV(ocorrencias);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=relatorio_ocorrencias.csv');

    return res.status(200).send(csvString);

  } else if (type === 'pdf') {
    const pdfBuffer = await ocorrenciaService.exportOcorrenciasToPDF(ocorrencias);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=relatorio_ocorrencias.pdf');

    return res.status(200).send(pdfBuffer);

  } else {
    throw new BadRequestError('Tipo de exportação inválido.');
  }
};