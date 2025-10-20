// src/services/bairroService.ts

import { PrismaClient, BairrosRecife } from '@prisma/client';
import { NotFoundError, ConflictError } from '../errors/api-errors'; // Importado ConflictError

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

// CORREÇÃO TS2304: Alterado para 'export async function' para garantir o hoisting (acessibilidade interna)
export async function getBairroById(id: string) {
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
  
  // Refatorado (4): Usando findFirst para checar se está em uso (performance)
  const ocorrenciaEmUso = await prisma.ocorrencia.findFirst({
    where: { id_bairro_fk: id },
  });

  if (ocorrenciaEmUso) {
    // Refatorado (5): Usando ConflictError (409)
    throw new ConflictError('Este bairro não pode ser deletado pois está em uso em ocorrências.');
  }
  await prisma.bairro.delete({ where: { id_bairro: id } });
};