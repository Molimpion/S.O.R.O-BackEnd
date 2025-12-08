import { PrismaClient, Status, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

interface DashboardFilters {
  dataInicio?: string;
  dataFim?: string;
  status?: Status;
  bairroId?: string;
  subgrupoId?: string;
  periodo?: 'day' | 'month'; 
}

const buildWhereClause = (filters: DashboardFilters) => {
  const { periodo: _, ...baseFilters } = filters; 
  const where: any = {};
  
  if (baseFilters.dataInicio) {
    where.carimbo_data_hora_abertura = { 
      ...where.carimbo_data_hora_abertura, 
      gte: new Date(baseFilters.dataInicio) 
    };
  }
  if (baseFilters.dataFim) {
    where.carimbo_data_hora_abertura = { 
      ...where.carimbo_data_hora_abertura, 
      lte: new Date(baseFilters.dataFim) 
    };
  }

  if (baseFilters.status) {
    where.status_situacao = baseFilters.status;
  }
  if (baseFilters.bairroId) {
    where.id_bairro_fk = baseFilters.bairroId;
  }
  if (baseFilters.subgrupoId) {
    where.id_subgrupo_fk = baseFilters.subgrupoId;
  }
  return where;
}

export const getOcorrenciasPorStatus = async (filters: DashboardFilters) => {
  const where = buildWhereClause(filters); 

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
  const where = buildWhereClause(filters); 

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
  const where = buildWhereClause(filters); 
  
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

export const getOcorrenciasPorMunicipio = async (filters: DashboardFilters) => {
  const where = buildWhereClause(filters); 

  const groupByBairro = await prisma.ocorrencia.groupBy({
    by: ['id_bairro_fk'],
    where: where,
    _count: { id_ocorrencia: true },
  });

  const bairroIds = groupByBairro.map(item => item.id_bairro_fk);
  const bairros = await prisma.bairro.findMany({
    where: { id_bairro: { in: bairroIds } },
    select: { id_bairro: true, id_municipio_fk: true },
  });

  const municipioIds = [
    ...new Set(bairros.map(b => b.id_municipio_fk).filter(id => id !== null)),
  ] as string[];

  const municipios = await prisma.municipio.findMany({
    where: { id_municipio: { in: municipioIds } },
    select: { id_municipio: true, nome_municipio: true },
  });

  const municipioMap = new Map(municipios.map(m => [m.id_municipio, m.nome_municipio]));
  const bairroToMunicipioMap = new Map(bairros.map(b => [b.id_bairro, b.id_municipio_fk]));
  const municipioCounts: { [key: string]: number } = {};

  for (const item of groupByBairro) {
    const municipioId = bairroToMunicipioMap.get(item.id_bairro_fk);
    let municipioName: string;

    if (municipioId) {
      municipioName = municipioMap.get(municipioId) || 'Município Desconhecido';
    } else {
      municipioName = 'Sem Município Associado';
    }
    
    if (!municipioCounts[municipioName]) {
      municipioCounts[municipioName] = 0;
    }
    municipioCounts[municipioName] += item._count.id_ocorrencia;
  }

  const result = Object.entries(municipioCounts)
    .map(([nome, total]) => ({ nome, total }))
    .sort((a, b) => b.total - a.total); 

  return result;
};

export const getOcorrenciasPorPeriodo = async (filters: DashboardFilters) => {
  const { periodo = 'day', ...baseFilters } = filters;
  const whereClauses: string[] = [];
  const parameters: any[] = [periodo]; 

  if (baseFilters.dataInicio) {
    whereClauses.push(`carimbo_data_hora_abertura >= $${parameters.length + 1}`);
    parameters.push(new Date(baseFilters.dataInicio));
  }
  if (baseFilters.dataFim) {
    whereClauses.push(`carimbo_data_hora_abertura <= $${parameters.length + 1}`);
    parameters.push(new Date(baseFilters.dataFim));
  }
  if (baseFilters.status) {
    whereClauses.push(`status_situacao = $${parameters.length + 1}`);
    parameters.push(baseFilters.status);
  }
  if (baseFilters.bairroId) {
    whereClauses.push(`id_bairro_fk = $${parameters.length + 1}`);
    parameters.push(baseFilters.bairroId);
  }
  if (baseFilters.subgrupoId) {
    whereClauses.push(`id_subgrupo_fk = $${parameters.length + 1}`);
    parameters.push(baseFilters.subgrupoId);
  }
  
  const whereQuery = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const query = `
    SELECT 
      DATE_TRUNC($1::text, carimbo_data_hora_abertura) as periodo,
      COUNT(id_ocorrencia) as total
    FROM "ocorrencias"
    ${whereQuery}
    GROUP BY periodo
    ORDER BY periodo ASC
  `;

  type ResultType = {
    periodo: Date;
    total: bigint; 
  };

  const result = await prisma.$queryRawUnsafe<ResultType[]>(query, ...parameters);

  return result.map(item => ({
    periodo: item.periodo.toISOString().split('T')[0], 
    total: Number(item.total),
  }));
};

export const getAvgCompletionTimePorTipo = async (filters: DashboardFilters) => {
  const { periodo: _, ...baseFilters } = filters;
  
  const whereClauses: string[] = [
    `o.status_situacao = 'CONCLUIDA'`, 
    `o.data_execucao_servico IS NOT NULL`
  ];
  const parameters: any[] = [];

  if (baseFilters.dataInicio) {
    whereClauses.push(`o.carimbo_data_hora_abertura >= $${parameters.length + 1}`);
    parameters.push(new Date(baseFilters.dataInicio));
  }
  if (baseFilters.dataFim) {
    whereClauses.push(`o.carimbo_data_hora_abertura <= $${parameters.length + 1}`);
    parameters.push(new Date(baseFilters.dataFim));
  }
  if (baseFilters.bairroId) {
    whereClauses.push(`o.id_bairro_fk = $${parameters.length + 1}`);
    parameters.push(baseFilters.bairroId);
  }
  if (baseFilters.subgrupoId) {
    whereClauses.push(`o.id_subgrupo_fk = $${parameters.length + 1}`);
    parameters.push(baseFilters.subgrupoId);
  }
  
  const whereQuery = `WHERE ${whereClauses.join(' AND ')}`;

  const query = `
    SELECT 
      s.descricao_subgrupo as nome,
      AVG(
        EXTRACT(EPOCH FROM (o.data_execucao_servico - o.carimbo_data_hora_abertura))
      ) as tempo_medio_segundos
    FROM "ocorrencias" o
    JOIN "subgrupos" s ON o.id_subgrupo_fk = s.id_subgrupo
    ${whereQuery}
    GROUP BY s.descricao_subgrupo
    ORDER BY tempo_medio_segundos DESC
  `;

  type ResultType = {
    nome: string;
    tempo_medio_segundos: number | null; 
  };

  const result = await prisma.$queryRawUnsafe<ResultType[]>(query, ...parameters);

  return result
    .filter(item => item.tempo_medio_segundos !== null) 
    .map(item => ({
      nome: item.nome,
      total: parseFloat((item.tempo_medio_segundos! / 3600).toFixed(2)), 
    }));
};
