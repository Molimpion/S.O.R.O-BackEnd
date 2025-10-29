import { PrismaClient, Status } from '@prisma/client';

const prisma = new PrismaClient();

interface DashboardFilters {
  dataInicio?: string;
  dataFim?: string;
  status?: Status;
  bairroId?: string;
  subgrupoId?: string;
}

const buildWhereClause = (filters: DashboardFilters) => {
  const where: any = {};
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

  const result = groupByType.map(item => {
    const subgrupo = subgrupos.find(s => s.id_subgrupo === item.id_subgrupo_fk);
    return {
      nome: subgrupo?.descricao_subgrupo || 'Desconhecido',
      total: item._count.id_ocorrencia,
    };
  });

  return result;
};

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

  const result = groupByBairro.map(item => {
    const bairro = bairros.find(m => m.id_bairro === item.id_bairro_fk);
    return {
      nome: bairro?.nome_bairro || 'Desconhecido',
      total: item._count.id_ocorrencia,
    };
  });

  return result;
};