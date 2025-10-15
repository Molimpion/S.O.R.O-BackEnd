// src/services/ocorrenciaService.ts
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

interface OcorrenciaFilters {
  dataInicio?: string;
  dataFim?: string;
  status?: Status;
  bairroId?: string;
  subgrupoId?: string;
  page?: number;
  limit?: number;
}

export const getAllOcorrencias = async (filters: OcorrenciaFilters) => {
  const { page = 1, limit = 10, dataInicio, dataFim, ...otherFilters } = filters;
  const where: any = {};
  if (dataInicio) {
    where.carimbo_data_hora_abertura = { ...where.carimbo_data_hora_abertura, gte: new Date(dataInicio) };
  }
  if (dataFim) {
    where.carimbo_data_hora_abertura = { ...where.carimbo_data_hora_abertura, lte: new Date(dataFim) };
  }
  if (otherFilters.status) {
    where.status_situacao = otherFilters.status;
  }
  if (otherFilters.bairroId) {
    where.id_bairro_fk = otherFilters.bairroId;
  }
  if (otherFilters.subgrupoId) {
    where.id_subgrupo_fk = otherFilters.subgrupoId;
  }
  const [ocorrencias, total] = await prisma.$transaction([
    prisma.ocorrencia.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { carimbo_data_hora_abertura: 'desc' },
      include: {
        subgrupo: true,
        bairro: true,
        usuario_abertura: { select: { id: true, nome: true, nome_guerra: true } },
      },
    }),
    prisma.ocorrencia.count({ where }),
  ]);
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
    include: {
      subgrupo: true,
      bairro: true,
      forma_acervo: true,
      usuario_abertura: { select: { id: true, nome: true, nome_guerra: true, posto_grad: true } },
      localizacao: true,
      vitimas: true,
      midias: true,
      viaturas_usadas: { include: { viatura: true } },
      equipe_ocorrencia: { include: { usuario: { select: { id: true, nome: true, nome_guerra: true, posto_grad: true } } } },
    },
  });
  if (!ocorrencia) {
    throw new NotFoundError('Ocorrência não encontrada');
  }
  return ocorrencia;
};
/**
 * Busca ocorrências com base em filtros e exporta o resultado como uma string CSV.
 * @param filters - Os mesmos filtros usados na listagem.
 */
export const exportOcorrenciasToCSV = async (filters: OcorrenciaFilters) => {
  // A lógica de construção do 'where' é a mesma da função 'getAllOcorrencias'
  const { dataInicio, dataFim, ...otherFilters } = filters;
  const where: any = {};
  if (dataInicio) {
    where.carimbo_data_hora_abertura = { ...where.carimbo_data_hora_abertura, gte: new Date(dataInicio) };
  }
  if (dataFim) {
    where.carimbo_data_hora_abertura = { ...where.carimbo_data_hora_abertura, lte: new Date(dataFim) };
  }
  if (otherFilters.status) {
    where.status_situacao = otherFilters.status;
  }
  if (otherFilters.bairroId) {
    where.id_bairro_fk = otherFilters.bairroId;
  }
  if (otherFilters.subgrupoId) {
    where.id_subgrupo_fk = otherFilters.subgrupoId;
  }

  // Buscamos os dados no banco, sem paginação, pois o relatório é completo
  const ocorrencias = await prisma.ocorrencia.findMany({
    where,
    orderBy: {
      carimbo_data_hora_abertura: 'desc',
    },
    include: {
      subgrupo: true,
      bairro: true,
      usuario_abertura: true,
    },
  });

  // Define as colunas e os cabeçalhos do nosso arquivo CSV
  const columns = [
    { key: 'nr_aviso', header: 'Nº Aviso' },
    { key: 'status_situacao', header: 'Status' },
    { key: 'data_acionamento', header: 'Data Acionamento' },
    { key: 'bairro.nome_bairro', header: 'Município' },
    { key: 'subgrupo.descricao_subgrupo', header: 'Subgrupo' },
    { key: 'usuario_abertura.nome', header: 'Usuário Abertura' },
  ];
  
  // Usa a biblioteca para converter o array de objetos JSON em uma string CSV
  const csvString = stringify(ocorrencias, {
    header: true,
    columns: columns,
    // Formata os dados aninhados (ex: bairro.nome_bairro)
    cast: {
      object: (value) => value?.nome_bairro || value?.descricao_subgrupo || value?.nome || '',
    }
  });

  return csvString;
};


/**
 * Busca ocorrências com base em filtros e retorna o resultado como um Buffer de PDF.
 * @param filters - Os mesmos filtros usados na listagem.
 */
export const exportOcorrenciasToPDF = async (filters: OcorrenciaFilters): Promise<Buffer> => {
  // A lógica de busca de dados é a mesma da exportação CSV
  const { dataInicio, dataFim, ...otherFilters } = filters;
  const where: any = {};
  if (dataInicio) { where.carimbo_data_hora_abertura = { ...where.carimbo_data_hora_abertura, gte: new Date(dataInicio) } }
  if (dataFim) { where.carimbo_data_hora_abertura = { ...where.carimbo_data_hora_abertura, lte: new Date(dataFim) } }
  if (otherFilters.status) { where.status_situacao = otherFilters.status }
  if (otherFilters.bairroId) { where.id_bairro_fk = otherFilters.bairroId }
  if (otherFilters.subgrupoId) { where.id_subgrupo_fk = otherFilters.subgrupoId }

  const ocorrencias = await prisma.ocorrencia.findMany({
    where,
    orderBy: { carimbo_data_hora_abertura: 'desc' },
    include: { subgrupo: true, bairro: true, usuario_abertura: true },
  });

  // A partir daqui, começa a criação do PDF
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    const buffers: Buffer[] = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer);
    });
    doc.on('error', reject);

    // ---- Conteúdo do PDF ----
    // Cabeçalho
    doc.fontSize(18).text('Relatório de Ocorrências', { align: 'center' });
    doc.moveDown();

    // Tabela de Dados
    const tableTop = 100;
    const rowHeight = 25;
    const headers = ['Data', 'Status', 'Município', 'Subgrupo', 'Nº Aviso'];

    // Desenha o cabeçalho da tabela
    doc.fontSize(10).font('Helvetica-Bold');
    headers.forEach((header, i) => {
      doc.text(header, 30 + i * 110, tableTop, { width: 100, align: 'left' });
    });

    // Desenha as linhas da tabela
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
    // ---- Fim do Conteúdo do PDF ----

    doc.end();
  });
};