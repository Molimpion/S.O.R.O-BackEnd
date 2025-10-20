import { Request, Response } from 'express';
import * as ocorrenciaService from '../services/ocorrenciaService';
import { BadRequestError } from '../errors/api-errors';

export const exportRelatorio = async (req: Request, res: Response) => {
  // O validador (listOcorrenciaSchema) garante que req.query.type exista e seja 'csv' ou 'pdf'.
  const { type, ...filters } = req.query as any;

  // 1. Executa a consulta unificada no banco
  const ocorrencias = await ocorrenciaService.getOcorrenciasForExport(filters);
  
  if (type === 'csv') {
    // 2. Chama a função de geração de CSV
    const csvString = await ocorrenciaService.exportOcorrenciasToCSV(ocorrencias);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=relatorio_ocorrencias.csv');

    return res.status(200).send(csvString);

  } else if (type === 'pdf') {
    // 3. Chama a função de geração de PDF
    const pdfBuffer = await ocorrenciaService.exportOcorrenciasToPDF(ocorrencias);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=relatorio_ocorrencias.pdf');

    return res.status(200).send(pdfBuffer);

  } else {
    // Caso de fallback (embora o validador deva prevenir isso)
    throw new BadRequestError('Tipo de exportação inválido.');
  }
};