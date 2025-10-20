// src/services/naturezaService.ts (CORRIGIDO: Sintaxe e Tipagem)
import { PrismaClient } from '@prisma/client'; // Removido TipoNatureza
import { NotFoundError, ConflictError } from '../errors/api-errors';

const prisma = new PrismaClient();

/**
 * Cria uma nova natureza de ocorrência.
 */
export async function createNatureza(descricao: string) { // Sintaxe Corrigida, Args: string
  const natureza = await prisma.natureza.create({
    data: { descricao },
  });
  return natureza;
};

export async function getAllNaturezas() { // Sintaxe Corrigida
  const naturezas = await prisma.natureza.findMany({
    orderBy: { descricao: 'asc' },
  });
  return naturezas;
};

export async function deleteNatureza(id: string) { // Sintaxe Corrigida
  const natureza = await prisma.natureza.findUnique({ where: { id_natureza: id } });
  if (!natureza) {
    throw new NotFoundError('Natureza não encontrada');
  }

  const grupoEmUso = await prisma.grupo.findFirst({
    where: { id_natureza_fk: id },
  });

  if (grupoEmUso) {
    throw new ConflictError('Esta natureza não pode ser deletada pois está em uso em Grupos.');
  }

  await prisma.natureza.delete({ where: { id_natureza: id } });
};