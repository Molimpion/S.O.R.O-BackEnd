import { PrismaClient } from '@prisma/client';
import { NotFoundError, BadRequestError } from '../errors/api-errors';

const prisma = new PrismaClient();

/**
 * Cria uma nova natureza de ocorrência.
 */
export const createNatureza = async (descricao: string) => {
  const natureza = await prisma.natureza.create({
    data: { descricao },
  });
  return natureza;
};

/**
 * Retorna todas as naturezas.
 */
export const getAllNaturezas = async () => {
  const naturezas = await prisma.natureza.findMany({
    orderBy: { descricao: 'asc' },
  });
  return naturezas;
};

/**
 * Deleta uma natureza.
 */
export const deleteNatureza = async (id: string) => {
  const natureza = await prisma.natureza.findUnique({ where: { id_natureza: id } });
  if (!natureza) {
    throw new NotFoundError('Natureza não encontrada');
  }

  // Verifica se a natureza não está sendo usada em algum grupo
  const gruposUsando = await prisma.grupo.count({
    where: { id_natureza_fk: id },
  });

  if (gruposUsando > 0) {
    throw new BadRequestError('Esta natureza não pode ser deletada pois está em uso em Grupos.');
  }

  await prisma.natureza.delete({ where: { id_natureza: id } });
};