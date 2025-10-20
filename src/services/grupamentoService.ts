// src/services/grupamentoService.ts (CORRIGIDO: Sintaxe)
import { PrismaClient } from '@prisma/client';
import { NotFoundError, ConflictError } from '../errors/api-errors';

const prisma = new PrismaClient();

export async function createGrupamento(data: { nome_grupamento: string; sigla: string }) { // Sintaxe Corrigida
  return await prisma.grupamento.create({ data });
};

export async function getAllGrupamentos() { // Sintaxe Corrigida
  return await prisma.grupamento.findMany({
    orderBy: { nome_grupamento: 'asc' },
  });
};

export async function deleteGrupamento(id: string) { // Sintaxe Corrigida
  const grupamento = await prisma.grupamento.findUnique({ where: { id_grupamento: id } });
  if (!grupamento) {
    throw new NotFoundError('Grupamento não encontrado');
  }

  const unidadeEmUso = await prisma.unidadeOperacional.findFirst({
    where: { id_grupamento_fk: id },
  });

  if (unidadeEmUso) {
    throw new ConflictError('Este grupamento não pode ser deletado pois está em uso por Unidades Operacionais.');
  }

  await prisma.grupamento.delete({ where: { id_grupamento: id } });
};