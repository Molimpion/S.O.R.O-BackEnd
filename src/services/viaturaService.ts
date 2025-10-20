// src/services/viaturaService.ts (CORRIGIDO: Sintaxe, PK e Tipagem)

import { PrismaClient } from '@prisma/client'; // Removido NumeroViatura
import { NotFoundError, ConflictError } from '../errors/api-errors';

const prisma = new PrismaClient();

interface ViaturaData {
  tipo_vt: string;
  numero_viatura: string; // Alterado para string
  id_unidade_operacional_fk: string;
}

export async function createViatura(data: ViaturaData) { // Sintaxe Corrigida
  const unidadeExists = await prisma.unidadeOperacional.findUnique({
    where: { id_unidade: data.id_unidade_operacional_fk },
  });
  if (!unidadeExists) {
    throw new NotFoundError('Unidade Operacional associada não encontrada.');
  }

  return await prisma.viatura.create({ data });
};

export async function getAllViaturas() { // Sintaxe Corrigida
  return await prisma.viatura.findMany({
    orderBy: { numero_viatura: 'asc' },
    include: {
      unidade_operacional: true,
    },
  });
};

/**
 * Deleta uma viatura pelo seu ID (o novo PK UUID).
 * @param id - O ID (UUID) da viatura a ser deletada.
 */
export async function deleteViatura(id: string) { // Sintaxe Corrigida, Args: string (novo PK)
  const viatura = await prisma.viatura.findUnique({ where: { id_viatura: id } }); // Busca pelo novo PK
  if (!viatura) {
    throw new NotFoundError('Viatura não encontrada');
  }

  const ocorrenciaViaturaEmUso = await prisma.ocorrenciaViatura.findFirst({
    where: { id_viatura_fk: id }, // Checa a FK pelo novo PK
  });

  if (ocorrenciaViaturaEmUso) {
    throw new ConflictError('Esta viatura não pode ser deletada pois está associada a ocorrências.');
  }

  await prisma.viatura.delete({ where: { id_viatura: id } }); // Deleta pelo novo PK
};