import PDFDocument from "pdfkit";
import { stringify } from "csv-stringify/sync";
import { PrismaClient, Status, Ocorrencia } from "@prisma/client";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/api-errors";
import { Express } from "express";

const prisma = new PrismaClient();

interface CreateOcorrenciaData {
  data_acionamento: string | Date;
  hora_acionamento: string | Date;
  id_subgrupo_fk: string;
  id_bairro_fk: string;
  id_forma_acervo_fk: string;
  nr_aviso?: string;
  observacoes?: string;
  localizacao?: {
    logradouro?: string;
    tipo_logradouro?: string;
    numero_km?: string;
    referencia_logradouro?: string;
    latitude?: number;
    longitude?: number;
  };
}

interface OcorrenciaFilters {
  dataInicio?: string;
  dataFim?: string;
  status?: Status;
  bairroId?: string;
  subgrupoId?: string;
}

interface UpdateOcorrenciaData {
  status_situacao?: Status;
  data_execucao_servico?: string | Date | null;
  relacionado_eleicao?: boolean;
  nr_aviso?: string;
}

export const createOcorrencia = async (
  data: CreateOcorrenciaData,
  userId: string
) => {
  if (!data.id_subgrupo_fk || !data.id_bairro_fk || !data.id_forma_acervo_fk) {
    throw new BadRequestError(
      "Faltam IDs de relacionamento obrigatórios para criar a ocorrência."
    );
  }

  const { localizacao, ...ocorrenciaData } = data;

  const novaOcorrencia = await prisma.ocorrencia.create({
    data: {
      ...ocorrenciaData,
      data_acionamento: new Date(data.data_acionamento),
      hora_acionamento: new Date(data.hora_acionamento),
      id_usuario_abertura_fk: userId,
      localizacao: localizacao
        ? {
            create: {
              logradouro: localizacao.logradouro,
              tipo_logradouro: localizacao.tipo_logradouro,
              numero_km: localizacao.numero_km,
              referencia_logradouro: localizacao.referencia_logradouro,
              latitude: localizacao.latitude,
              longitude: localizacao.longitude,
            },
          }
        : undefined,
    },
    include: {
      localizacao: true,
    },
  });
  return novaOcorrencia;
};

export const getAllOcorrencias = async (filters: any) => {
  const pageParam = filters.page ?? 1;
  const limitParam = filters.limit ?? 10;
  const { dataInicio, dataFim, ...otherFilters } = filters;
  const page = parseInt(String(pageParam), 10);
  const limit = parseInt(String(limitParam), 10);
  const safePage = isNaN(page) || page < 1 ? 1 : page;
  const safeLimit = isNaN(limit) || limit < 1 ? 10 : limit;
  const where: any = {};
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
  if (otherFilters.status) {
    where.status_situacao = otherFilters.status;
  }
  if (otherFilters.bairroId) {
    where.id_bairro_fk = otherFilters.bairroId;
  }
  if (otherFilters.subgrupoId) {
    where.id_subgrupo_fk = otherFilters.subgrupoId;
  }
  const total = await prisma.ocorrencia.count({ where });
  const ocorrencias = await prisma.ocorrencia.findMany({
    where,
    skip: (safePage - 1) * safeLimit,
    take: safeLimit,
    orderBy: { carimbo_data_hora_abertura: "desc" },
    include: {
      subgrupo: true,
      bairro: true,
      usuario_abertura: { select: { id: true, nome: true, nome_guerra: true } },
    },
  });
  return {
    data: ocorrencias,
    total,
    page: safePage,
    totalPages: Math.ceil(total / safeLimit),
  };
};

export const getOcorrenciaById = async (id: string) => {
  const ocorrencia = await prisma.ocorrencia.findUnique({
    where: { id_ocorrencia: id },
    include: {
      subgrupo: true,
      bairro: true,
      forma_acervo: true,
      usuario_abertura: {
        select: { id: true, nome: true, nome_guerra: true, posto_grad: true },
      },
      localizacao: true,
      vitimas: true,
      midias: true,
      viaturas_usadas: {
        select: {
          horario_chegada_local: true,
          horario_saida_local: true,
          viatura: true,
        },
      },
      equipe_ocorrencia: {
        select: {
          funcao_na_equipe: true,
          usuario: {
            select: {
              id: true,
              nome: true,
              nome_guerra: true,
              posto_grad: true,
            },
          },
        },
      },
    },
  });
  if (!ocorrencia) {
    throw new NotFoundError("Ocorrência não encontrada");
  }
  return ocorrencia;
};

export const updateOcorrencia = async (
  id: string,
  data: UpdateOcorrenciaData,
  userId: string,
  userProfile: string
): Promise<Ocorrencia> => {
  const ocorrencia = await prisma.ocorrencia.findUnique({
    where: { id_ocorrencia: id },
  });
  if (!ocorrencia) {
    throw new NotFoundError("Ocorrência não encontrada");
  }

  const isOwner = ocorrencia.id_usuario_abertura_fk === userId;
  const hasPermission = ["ADMIN", "CHEFE", "OPERADOR_CAMPO"].includes(
    userProfile
  );

  if (!isOwner && !hasPermission) {
    throw new UnauthorizedError(
      "Acesso negado: Você não tem permissão para editar esta ocorrência."
    );
  }

  const dataToUpdate: any = { ...data };
  if (data.data_execucao_servico) {
    dataToUpdate.data_execucao_servico = new Date(data.data_execucao_servico);
  } else if (data.data_execucao_servico === null) {
    dataToUpdate.data_execucao_servico = null;
  }
  const updatedOcorrencia = await prisma.ocorrencia.update({
    where: { id_ocorrencia: id },
    data: dataToUpdate,
    include: {
      subgrupo: true,
      bairro: true,
      usuario_abertura: { select: { id: true, nome: true, nome_guerra: true } },
    },
  });
  return updatedOcorrencia;
};

export const addMidiaToOcorrencia = async (
  ocorrenciaId: string,
  userId: string,
  file: Express.Multer.File
) => {
  const ocorrencia = await prisma.ocorrencia.findUnique({
    where: { id_ocorrencia: ocorrenciaId },
  });

  if (!ocorrencia) {
    throw new NotFoundError("Ocorrência não encontrada");
  }

  const url_caminho = file.path;
  const tipo_arquivo = file.mimetype;

  const novaMidia = await prisma.midia.create({
    data: {
      url_caminho: url_caminho,
      tipo_arquivo: tipo_arquivo,
      id_ocorrencia_fk: ocorrenciaId,
      id_usuario_upload_fk: userId,
    },
  });

  return novaMidia;
};

export const getOcorrenciasForExport = async (filters: OcorrenciaFilters) => {
  const { dataInicio, dataFim, status, bairroId, subgrupoId } = filters;
  const where: any = {};
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
  if (status) {
    where.status_situacao = status;
  }
  if (bairroId) {
    where.id_bairro_fk = bairroId;
  }
  if (subgrupoId) {
    where.id_subgrupo_fk = subgrupoId;
  }
  return await prisma.ocorrencia.findMany({
    where,
    orderBy: { carimbo_data_hora_abertura: "desc" },
    include: { subgrupo: true, bairro: true, usuario_abertura: true },
  });
};

export const exportOcorrenciasToCSV = async (ocorrencias: any[]) => {
  const columns = [
    { key: "nr_aviso", header: "Nº Aviso" },
    { key: "status_situacao", header: "Status" },
    { key: "data_acionamento", header: "Data Acionamento" },
    { key: "bairro.nome_bairro", header: "Bairro" },
    { key: "subgrupo.descricao_subgrupo", header: "Subgrupo" },
    { key: "usuario_abertura.nome", header: "Usuário Abertura" },
  ];
  const csvString = stringify(ocorrencias, {
    header: true,
    columns: columns,
    cast: {
      object: (value) =>
        value?.nome_bairro || value?.descricao_subgrupo || value?.nome || "",
    },
  });
  return csvString;
};

export const exportOcorrenciasToPDF = async (
  ocorrencias: any[]
): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 30, size: "A4" });
    const buffers: Buffer[] = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer);
    });
    doc.on("error", reject);
    doc.fontSize(18).text("Relatório de Ocorrências", { align: "center" });
    doc.moveDown();
    const tableTop = 100;
    const rowHeight = 25;
    const headers = ["Data", "Status", "Bairro", "Subgrupo", "Nº Aviso"];
    doc.fontSize(10).font("Helvetica-Bold");
    headers.forEach((header, i) => {
      doc.text(header, 30 + i * 110, tableTop, { width: 100, align: "left" });
    });
    doc.fontSize(8).font("Helvetica");
    ocorrencias.forEach((ocorrencia, rowIndex) => {
      const y = tableTop + (rowIndex + 1) * rowHeight;
      const row = [
        new Date(ocorrencia.data_acionamento).toLocaleDateString(),
        ocorrencia.status_situacao,
        ocorrencia.bairro.nome_bairro,
        ocorrencia.subgrupo.descricao_subgrupo,
        ocorrencia.nr_aviso || "-",
      ];
      row.forEach((cell, i) => {
        doc.text(cell, 30 + i * 110, y, { width: 100, align: "left" });
      });
    });
    doc.end();
  });
};
