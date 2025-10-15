// src/services/bairroService.ts (CORRIGIDO)
import { PrismaClient, BairrosRecife } from '@prisma/client';
import { NotFoundError, BadRequestError } from '../errors/api-errors';

const prisma = new PrismaClient();

interface BairroData {
  nome_bairro: BairrosRecife;
  regiao?: string;
  ais?: string;
}

export const createBairro = async (data: BairroData) => {
  const bairro = await prisma.bairro.create({ data });
  return bairro;
};

export const getAllBairros = async () => {
  const bairros = await prisma.bairro.findMany({
    orderBy: { nome_bairro: 'asc' },
  });
  return bairros;
};

export const getBairroById = async (id: string) => {
  const bairro = await prisma.bairro.findUnique({ where: { id_bairro: id } });
  if (!bairro) {
    throw new NotFoundError('Bairro não encontrado');
  }
  return bairro;
};

export const updateBairro = async (id: string, data: Partial<BairroData>) => {
  await getBairroById(id);
  const updatedBairro = await prisma.bairro.update({
    where: { id_bairro: id },
    data,
  });
  return updatedBairro;
};

export const deleteBairro = async (id: string) => {
  await getBairroById(id);
  const ocorrenciasUsando = await prisma.ocorrencia.count({
    where: { id_bairro_fk: id },
  });
  if (ocorrenciasUsando > 0) {
    throw new BadRequestError('Este bairro não pode ser deletado pois está em uso em ocorrências.');
  }
  await prisma.bairro.delete({ where: { id_bairro: id } });
};