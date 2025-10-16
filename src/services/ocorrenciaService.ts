import { PrismaClient, Status } from '@prisma/client';
import { BadRequestError, NotFoundError } from '../errors/api-errors';
import { stringify } from 'csv-stringify/sync';
import PDFDocument from 'pdfkit';

const prisma = new PrismaClient();

// ... (interface CreateOcorrenciaData e função createOcorrencia continuam iguais)

// Interface de Filtros ATUALIZADA
interface OcorrenciaFilters {
  dataInicio?: string;
  dataFim?: string;
  status?: Status;
  bairroId?: string; // ALTERADO
  subgrupoId?: string;
  page?: number;
  limit?: number;
}

// Função de Listagem ATUALIZADA
export const getAllOcorrencias = async (filters: OcorrenciaFilters) => {
  const { page = 1, limit = 10, dataInicio, dataFim, ...otherFilters } = filters;
  const where: any = {};
  if (dataInicio) { where.carimbo_data_hora_abertura = { ...where.carimbo_data_hora_abertura, gte: new Date(dataInicio) } }
  if (dataFim) { where.carimbo_data_hora_abertura = { ...where.carimbo_data_hora_abertura, lte: new Date(dataFim) } }
  if (otherFilters.status) { where.status_situacao = otherFilters.status }
  if (otherFilters.bairroId) { where.id_bairro_fk = otherFilters.bairroId } // ALTERADO
  if (otherFilters.subgrupoId) { where.id_subgrupo_fk = otherFilters.subgrupoId }

  const [ocorrencias, total] = await prisma.$transaction([
    prisma.ocorrencia.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { carimbo_data_hora_abertura: 'desc' },
      include: {
        subgrupo: true,
        bairro: true, // ALTERADO
        usuario_abertura: { select: { id: true, nome: true, nome_guerra: true } },
      },
    }),
    prisma.ocorrencia.count({ where }),
  ]);
  return { data: ocorrencias, total, page, totalPages: Math.ceil(total / limit) };
};

// ... (função getOcorrenciaById continua igual, mas verifique o 'include' para 'bairro')

// Função de Exportação CSV ATUALIZADA
export const exportOcorrenciasToCSV = async (filters: OcorrenciaFilters) => {
  // Lógica de filtros...
  const { dataInicio, dataFim, ...otherFilters } = filters;
  const where: any = {};
  if (dataInicio) { where.carimbo_data_hora_abertura = { gte: new Date(dataInicio) } }
  // ... (outros filtros)
  if (otherFilters.bairroId) { where.id_bairro_fk = otherFilters.bairroId } // ALTERADO

  const ocorrencias = await prisma.ocorrencia.findMany({
    where,
    include: { subgrupo: true, bairro: true, usuario_abertura: true }, // ALTERADO
  });
  
  const columns = [
    { key: 'nr_aviso', header: 'Nº Aviso' },
    { key: 'status_situacao', header: 'Status' },
    { key: 'data_acionamento', header: 'Data Acionamento' },
    { key: 'bairro.nome_bairro', header: 'Bairro' }, // ALTERADO
    { key: 'subgrupo.descricao_subgrupo', header: 'Subgrupo' },
    { key: 'usuario_abertura.nome', header: 'Utilizador Abertura' },
  ];
  
  const csvString = stringify(ocorrencias, {
    header: true,
    columns: columns,
    cast: {
      object: (value) => value?.nome_bairro || value?.descricao_subgrupo || value?.nome || '', // ALTERADO
    }
  });
  return csvString;
};

// ... (função de exportação para PDF, verifique os campos para 'bairro')