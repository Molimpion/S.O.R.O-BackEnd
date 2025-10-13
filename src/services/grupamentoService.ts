import { PrismaClient } from '@prisma/client';
import { NotFoundError, BadRequestError } from '../errors/api-errors';

const prisma = new PrismaClient();

/**
 * Cria um novo grupamento.
 */
export const createGrupamento = async (data: { nome_grupamento: string; sigla: string }) => {
  return await prisma.grupamento.create({ data });
};

/**
 * Retorna todos os grupamentos.
 */
export const getAllGrupamentos = async () => {
  return await prisma.grupamento.findMany({
    orderBy: { nome_grupamento: 'asc' },
  });
};

/**
 * Deleta um grupamento.
 */
export const deleteGrupamento = async (id: string) => {
  const grupamento = await prisma.grupamento.findUnique({ where: { id_grupamento: id } });
  if (!grupamento) {
    throw new NotFoundError('Grupamento não encontrado');
  }

  const unidadesUsando = await prisma.unidadeOperacional.count({
    where: { id_grupamento_fk: id },
  });

  if (unidadesUsando > 0) {
    throw new BadRequestError('Este grupamento não pode ser deletado pois está em uso por Unidades Operacionais.');
  }

  await prisma.grupamento.delete({ where: { id_grupamento: id } });
};