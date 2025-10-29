import { PrismaClient } from '@prisma/client';
import { NotFoundError, ConflictError } from '../errors/api-errors';

const prisma = new PrismaClient();

export async function createNatureza(descricao: string) {
  const natureza = await prisma.natureza.create({
    data: { descricao },
  });
  return natureza;
};

export async function getAllNaturezas() {
  const naturezas = await prisma.natureza.findMany({
    orderBy: { descricao: 'asc' },
  });
  return naturezas;
};

export async function deleteNatureza(id: string) {
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