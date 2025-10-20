// src/services/dashboardService.ts

import { PrismaClient, Status } from '@prisma/client';

const prisma = new PrismaClient();

// Define a interface para os filtros passados para as funções de serviço
interface DashboardFilters {
  dataInicio?: string;
  dataFim?: string;
  status?: Status;
  bairroId?: string;
  subgrupoId?: string;
}

// Função utilitária para construir a cláusula 'where' com base nos filtros
const buildWhereClause = (filters: DashboardFilters) => {
  const where: any = {};
  // Filtro por período de data de abertura
  if (filters.dataInicio) {
    where.carimbo_data_hora_abertura = { 
      ...where.carimbo_data_hora_abertura, 
      gte: new Date(filters.dataInicio) 
    };
  }
  if (filters.dataFim) {
    where.carimbo_data_hora_abertura = { 
      ...where.carimbo_data_hora_abertura, 
      lte: new Date(filters.dataFim) 
    };
  }
  // Outros filtros
  if (filters.status) {
    where.status_situacao = filters.status;
  }
  if (filters.bairroId) {
    where.id_bairro_fk = filters.bairroId;
  }
  if (filters.subgrupoId) {
    where.id_subgrupo_fk = filters.subgrupoId;
  }
  return where;
}

/**
 * Calcula e retorna o número de ocorrências para cada status, aplicando filtros.
 */
export const getOcorrenciasPorStatus = async (filters: DashboardFilters) => {
  const where = buildWhereClause(filters); // <-- Aplicando filtro

  const groupByStatus = await prisma.ocorrencia.groupBy({
    by: ['status_situacao'],
    where: where,
    _count: { id_ocorrencia: true },
  });

  const formattedResult = groupByStatus.reduce((acc, current) => {
    acc[current.status_situacao] = current._count.id_ocorrencia;
    return acc;
  }, {} as Record<Status, number>);

  return formattedResult;
};

/**
 * Calcula e retorna o número de ocorrências para cada tipo (Subgrupo), aplicando filtros.
 */
export const getOcorrenciasPorTipo = async (filters: DashboardFilters) => {
  const where = buildWhereClause(filters); // <-- Aplicando filtro

  const groupByType = await prisma.ocorrencia.groupBy({
    by: ['id_subgrupo_fk'],
    where: where,
    _count: { id_ocorrencia: true },
    orderBy: {
      _count: {
        id_ocorrencia: 'desc',
      },
    },
  });

  // Pega os IDs dos subgrupos para buscar seus nomes
  const subgrupoIds = groupByType.map(item => item.id_subgrupo_fk);
  const subgrupos = await prisma.subgrupo.findMany({
    where: {
      id_subgrupo: { in: subgrupoIds },
    },
    select: {
      id_subgrupo: true,
      descricao_subgrupo: true,
    },
  });

  // Mapeia os nomes para os resultados
  const result = groupByType.map(item => {
    const subgrupo = subgrupos.find(s => s.id_subgrupo === item.id_subgrupo_fk);
    return {
      nome: subgrupo?.descricao_subgrupo || 'Desconhecido',
      total: item._count.id_ocorrencia,
    };
  });

  return result;
};

/**
 * Calcula e retorna o número de ocorrências para cada Bairro, aplicando filtros.
 */
export const getOcorrenciasPorBairro = async (filters: DashboardFilters) => {
  const where = buildWhereClause(filters); // <-- Aplicando filtro
  
  const groupByBairro = await prisma.ocorrencia.groupBy({
    by: ['id_bairro_fk'],
    where: where,
    _count: { id_ocorrencia: true },
    orderBy: {
      _count: {
        id_ocorrencia: 'desc',
      },
    },
  });

  // Pega os IDs dos bairros para buscar seus nomes
  const bairroIds = groupByBairro.map(item => item.id_bairro_fk);
  const bairros = await prisma.bairro.findMany({
    where: {
      id_bairro: { in: bairroIds },
    },
    select: {
      id_bairro: true,
      nome_bairro: true,
    },
  });

  // Mapeia os nomes para os resultados
  const result = groupByBairro.map(item => {
    const bairro = bairros.find(m => m.id_bairro === item.id_bairro_fk);
    return {
      nome: bairro?.nome_bairro || 'Desconhecido',
      total: item._count.id_ocorrencia,
    };
  });

  return result;
};