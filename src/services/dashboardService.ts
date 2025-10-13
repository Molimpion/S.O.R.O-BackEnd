import { PrismaClient, Status } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Calcula e retorna o número de ocorrências para cada status.
 */
export const getOcorrenciasPorStatus = async () => {
  const groupByStatus = await prisma.ocorrencia.groupBy({
    by: ['status_situacao'],
    _count: { id_ocorrencia: true },
  });

  const formattedResult = groupByStatus.reduce((acc, current) => {
    acc[current.status_situacao] = current._count.id_ocorrencia;
    return acc;
  }, {} as Record<Status, number>);

  return formattedResult;
};

/**
 * Calcula e retorna o número de ocorrências para cada tipo (Subgrupo).
 */
export const getOcorrenciasPorTipo = async () => {
  const groupByType = await prisma.ocorrencia.groupBy({
    by: ['id_subgrupo_fk'],
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
 * Calcula e retorna o número de ocorrências para cada Município.
 */
export const getOcorrenciasPorMunicipio = async () => {
  const groupByMunicipio = await prisma.ocorrencia.groupBy({
    by: ['id_municipio_fk'],
    _count: { id_ocorrencia: true },
    orderBy: {
      _count: {
        id_ocorrencia: 'desc',
      },
    },
  });

  // Pega os IDs dos municípios para buscar seus nomes
  const municipioIds = groupByMunicipio.map(item => item.id_municipio_fk);
  const municipios = await prisma.municipio.findMany({
    where: {
      id_municipio: { in: municipioIds },
    },
    select: {
      id_municipio: true,
      nome_municipio: true,
    },
  });

  // Mapeia os nomes para os resultados
  const result = groupByMunicipio.map(item => {
    const municipio = municipios.find(m => m.id_municipio === item.id_municipio_fk);
    return {
      nome: municipio?.nome_municipio || 'Desconhecido',
      total: item._count.id_ocorrencia,
    };
  });

  return result;
};