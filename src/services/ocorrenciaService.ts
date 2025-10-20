// src/services/ocorrenciaService.ts (FINAL COM CORREÇÃO DE EXECUÇÃO)

import PDFDocument from 'pdfkit';
import { stringify } from 'csv-stringify/sync';
import { PrismaClient, Status } from '@prisma/client';
import { BadRequestError, NotFoundError } from '../errors/api-errors';

const prisma = new PrismaClient();

interface CreateOcorrenciaData {
 data_acionamento: string | Date;
 hora_acionamento: string | Date;
 id_subgrupo_fk: string;
 id_bairro_fk: string;
 id_forma_acervo_fk: string;
 nr_aviso?: string;
}

// Interface de filtros (simplificada para as funções de exportação)
interface OcorrenciaFilters {
 dataInicio?: string;
 dataFim?: string;
 status?: Status;
 bairroId?: string;
 subgrupoId?: string;
 // page e limit ignorados para exportação
}

export const createOcorrencia = async (data: CreateOcorrenciaData, userId: string) => {
 if (!data.id_subgrupo_fk || !data.id_bairro_fk || !data.id_forma_acervo_fk) {
  throw new BadRequestError('Faltam IDs de relacionamento obrigatórios para criar a ocorrência.');
 }
 const novaOcorrencia = await prisma.ocorrencia.create({
  data: {
   ...data,
   data_acionamento: new Date(data.data_acionamento),
   hora_acionamento: new Date(data.hora_acionamento),
   id_usuario_abertura_fk: userId,
  },
 });
 return novaOcorrencia;
};

export const getAllOcorrencias = async (filters: any) => {
 const { page = 1, limit = 10, dataInicio, dataFim, ...otherFilters } = filters;
 const where: any = {};
  
  // Lógica de filtro de data corrigida permanece
  const dateFilter: any = {};
  let isDateFilterActive = false;

  if (dataInicio) {
    dateFilter.gte = new Date(dataInicio);
    isDateFilterActive = true;
  }
  if (dataFim) {
    dateFilter.lte = new Date(dataFim);
    isDateFilterActive = true;
  }
  
  if (isDateFilterActive) {
      where.carimbo_data_hora_abertura = dateFilter;
  }
  // Fim da lógica de filtro de data

 if (otherFilters.status) {
  where.status_situacao = otherFilters.status;
 }
 if (otherFilters.bairroId) {
  where.id_bairro_fk = otherFilters.bairroId;
 }
 if (otherFilters.subgrupoId) {
  where.id_subgrupo_fk = otherFilters.subgrupoId;
 }
  
  // CORREÇÃO: Executa as queries sequencialmente, removendo prisma.$transaction
 const total = await prisma.ocorrencia.count({ where });
 const ocorrencias = await prisma.ocorrencia.findMany({
  where,
  skip: (page - 1) * limit,
  take: limit,
  orderBy: { carimbo_data_hora_abertura: 'desc' },
  include: {
   subgrupo: true,
   bairro: true,
   usuario_abertura: { select: { id: true, nome: true, nome_guerra: true } },
  },
 });
  
 return {
  data: ocorrencias,
  total,
  page,
  totalPages: Math.ceil(total / limit),
 };
};

export const getOcorrenciaById = async (id: string) => {
 const ocorrencia = await prisma.ocorrencia.findUnique({
  where: { id_ocorrencia: id },
  // SUGESTÃO DE MELHORIA: Usar 'select' dentro de 'include' para performance.
  include: {
   subgrupo: true,
   bairro: true,
   forma_acervo: true,
   usuario_abertura: { 
    select: { id: true, nome: true, nome_guerra: true, posto_grad: true } 
   },
   localizacao: true,
   vitimas: true,
   midias: true,
   viaturas_usadas: { 
    select: { 
     horario_chegada_local: true,
     horario_saida_local: true,
     viatura: true // Continua a trazer o objeto completo da viatura
    } 
   },
   equipe_ocorrencia: { 
    select: { 
     funcao_na_equipe: true,
     usuario: { select: { id: true, nome: true, nome_guerra: true, posto_grad: true } }
    } 
   },
  },
 });
 if (!ocorrencia) {
  throw new NotFoundError('Ocorrência não encontrada');
 }
 return ocorrencia;
};


// ----------------------------------------------------
// FUNÇÃO UNIFICADA DE CONSULTA PARA EXPORTAÇÃO
// ----------------------------------------------------
export const getOcorrenciasForExport = async (filters: OcorrenciaFilters) => {
 const { dataInicio, dataFim, status, bairroId, subgrupoId } = filters;
 const where: any = {};

  // CORREÇÃO FINAL: Constrói o filtro de data separadamente para garantir a segurança.
  const dateFilter: any = {};
  let isDateFilterActive = false;
  
  if (dataInicio) {
    dateFilter.gte = new Date(dataInicio);
    isDateFilterActive = true;
  }
  if (dataFim) {
    dateFilter.lte = new Date(dataFim);
    isDateFilterActive = true;
  }
  
  if (isDateFilterActive) {
      where.carimbo_data_hora_abertura = dateFilter;
  }
  // Fim da correção de filtro de data

 if (status) { where.status_situacao = status }
 if (bairroId) { where.id_bairro_fk = bairroId }
 if (subgrupoId) { where.id_subgrupo_fk = subgrupoId }

 return await prisma.ocorrencia.findMany({
  where,
  orderBy: { carimbo_data_hora_abertura: 'desc' },
  include: { subgrupo: true, bairro: true, usuario_abertura: true },
 });
}


// ----------------------------------------------------
// FUNÇÕES DE EXPORTAÇÃO (Recebem apenas os dados, não os filtros)
// ----------------------------------------------------

export const exportOcorrenciasToCSV = async (ocorrencias: any[]) => { // Recebe os dados
 const columns = [
  { key: 'nr_aviso', header: 'Nº Aviso' },
  { key: 'status_situacao', header: 'Status' },
  { key: 'data_acionamento', header: 'Data Acionamento' },
  { key: 'bairro.nome_bairro', header: 'Bairro' },
  { key: 'subgrupo.descricao_subgrupo', header: 'Subgrupo' },
  { key: 'usuario_abertura.nome', header: 'Usuário Abertura' },
 ];
 
 const csvString = stringify(ocorrencias, {
  header: true,
  columns: columns,
  cast: {
   object: (value) => value?.nome_bairro || value?.descricao_subgrupo || value?.nome || '',
  }
 });

 return csvString;
};

export const exportOcorrenciasToPDF = async (ocorrencias: any[]): Promise<Buffer> => { // Recebe os dados
 return new Promise((resolve, reject) => {
  const doc = new PDFDocument({ margin: 30, size: 'A4' });
  const buffers: Buffer[] = [];

  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {
   const pdfBuffer = Buffer.concat(buffers);
   resolve(pdfBuffer);
  });
  doc.on('error', reject);

  doc.fontSize(18).text('Relatório de Ocorrências', { align: 'center' });
  doc.moveDown();

  const tableTop = 100;
  const rowHeight = 25;
  const headers = ['Data', 'Status', 'Bairro', 'Subgrupo', 'Nº Aviso'];

  doc.fontSize(10).font('Helvetica-Bold');
  headers.forEach((header, i) => {
   doc.text(header, 30 + i * 110, tableTop, { width: 100, align: 'left' });
  });

  doc.fontSize(8).font('Helvetica');
  ocorrencias.forEach((ocorrencia, rowIndex) => {
   const y = tableTop + (rowIndex + 1) * rowHeight;
   const row = [
    new Date(ocorrencia.data_acionamento).toLocaleDateString(),
    ocorrencia.status_situacao,
    ocorrencia.bairro.nome_bairro,
    ocorrencia.subgrupo.descricao_subgrupo,
    ocorrencia.nr_aviso || '-',
   ];
   row.forEach((cell, i) => {
    doc.text(cell, 30 + i * 110, y, { width: 100, align: 'left' });
   });
  });

  doc.end();
 });
};