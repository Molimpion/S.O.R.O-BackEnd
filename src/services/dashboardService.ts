// src/services/dashboardService.ts
import { PrismaClient, Status } from '@prisma/client';

const prisma = new PrismaClient();

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

export const getOcorrenciasPorTipo = async () => {
  const groupByType = await prisma.ocorrencia.groupBy({
    by: ['id_subgrupo_fk'],
    _count: { id_ocorrencia: true },
    orderBy: { _count: { id_ocorrencia: 'desc' } },
  });

  const subgrupoIds = groupByType.map(item => item.id_subgrupo_fk);
  const subgrupos = await prisma.subgrupo.findMany({
    where: { id_subgrupo: { in: subgrupoIds } },
    select: { id_subgrupo: true, descricao_subgrupo: true },
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

export const getOcorrenciasPorBairro = async () => {
  const groupByBairro = await prisma.ocorrencia.groupBy({
    by: ['id_bairro_fk'],
    _count: { id_ocorrencia: true },
    orderBy: { _count: { id_ocorrencia: 'desc' } },
  });

  const bairroIds = groupByBairro.map(item => item.id_bairro_fk);
  const bairros = await prisma.bairro.findMany({
    where: { id_bairro: { in: bairroIds } },
    select: { id_bairro: true, nome_bairro: true },
  });

  const result = groupByBairro.map(item => {
    const bairro = bairros.find(m => m.id_bairro === item.id_bairro_fk);
    return {
      nome: bairro?.nome_bairro.toString() || 'Desconhecido',
      total: item._count.id_ocorrencia,
    };
  });

  return result;
};