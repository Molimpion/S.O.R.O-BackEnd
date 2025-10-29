// src/services/ocorrenciaService.ts (COM A VERIFICAÇÃO DE AUTORIZAÇÃO)

import PDFDocument from 'pdfkit';
import { stringify } from 'csv-stringify/sync';
import { PrismaClient, Status, Ocorrencia } from '@prisma/client';
// --- ALTERAÇÃO 1: Importando o erro de autorização ---
import { 
  BadRequestError, 
  NotFoundError, 
  UnauthorizedError // <-- ADICIONADO
} from '../errors/api-errors';

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

// --- ALTERAÇÃO 2: Interface de Update permite 'null' para limpar data ---
interface UpdateOcorrenciaData {
  status_situacao?: Status;
  data_execucao_servico?: string | Date | null; // <-- PERMITE NULL
  relacionado_eleicao?: boolean;
  nr_aviso?: string;
}
// --- FIM DA ALTERAÇÃO 2 ---


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
  // Pega os valores da query, definindo padrões se não existirem
  const pageParam = filters.page ?? 1;
  const limitParam = filters.limit ?? 10;
  const { dataInicio, dataFim, ...otherFilters } = filters;

  // *** CORREÇÃO: Converter page e limit para número ***
  const page = parseInt(String(pageParam), 10);
  const limit = parseInt(String(limitParam), 10);

  // Verifica se a conversão deu certo (caso contrário, usa padrões seguros)
  const safePage = isNaN(page) || page < 1 ? 1 : page;
  const safeLimit = isNaN(limit) || limit < 1 ? 10 : limit;
  // *** FIM DA CORREÇÃO ***


  const where: any = {};

  // Lógica de filtro de data permanece
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
  // *** USAR OS VALORES CONVERTIDOS E SEGUROS ***
  skip: (safePage - 1) * safeLimit,
  take: safeLimit,
  // *** FIM DA ALTERAÇÃO ***
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
  page: safePage, // Retorna a página segura usada
  totalPages: Math.ceil(total / safeLimit), // Usa o limite seguro no cálculo
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

// --- SUBSTITUÍDO (PASSO 2 COMPLETO) ---
/**
 * Atualiza uma ocorrência existente, verificando se o usuário
 * é o dono da ocorrência.
 * @param id O ID da ocorrência (UUID) a ser atualizada
 * @param data Os dados para atualizar (já validados pelo Zod)
 * @param userId O ID do usuário (Analista) que está fazendo a requisição
 */
export const updateOcorrencia = async (
  id: string,
  data: UpdateOcorrenciaData,
  userId: string // <-- PARÂMETRO DE AUTORIZAÇÃO ADICIONADO
): Promise<Ocorrencia> => {
  
  // 1. Buscamos a ocorrência primeiro
  const ocorrencia = await prisma.ocorrencia.findUnique({
    where: { id_ocorrencia: id },
  });

  // 2. Verificamos se ela existe
  if (!ocorrencia) {
    throw new NotFoundError('Ocorrência não encontrada');
  }

  // 3. (REQUISITO CHAVE) Verificamos a AUTORIZAÇÃO (se o dono é o mesmo)
  if (ocorrencia.id_usuario_abertura_fk !== userId) {
    throw new UnauthorizedError('Acesso negado: Você não tem permissão para editar esta ocorrência.');
  }

  // 4. Prepara os dados (converte datas se necessário)
  const dataToUpdate: any = { ...data };
  if (data.data_execucao_servico) {
    dataToUpdate.data_execucao_servico = new Date(data.data_execucao_servico);
  } else if (data.data_execucao_servico === null) {
    dataToUpdate.data_execucao_servico = null; // Permite limpar a data
  }

  // 5. Executa a atualização no banco de dados
  const updatedOcorrencia = await prisma.ocorrencia.update({
    where: { id_ocorrencia: id },
    data: dataToUpdate,
    include: { // Retorna a ocorrência atualizada com dados essenciais
        subgrupo: true,
        bairro: true,
        usuario_abertura: { select: { id: true, nome: true, nome_guerra: true } },
    }
  });

  return updatedOcorrencia;
};
// --- FIM DO CÓDIGO SUBSTITUÍDO ---


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