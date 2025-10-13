import { PrismaClient } from '@prisma/client';
import { NotFoundError, BadRequestError } from '../errors/api-errors';

const prisma = new PrismaClient();

/**
 * Cria uma nova forma de acervo.
 */
export const createFormaAcervo = async (descricao: string) => {
  const formaAcervo = await prisma.formaAcervo.create({
    data: { descricao },
  });
  return formaAcervo;
};

/**
 * Retorna todas as formas de acervo.
 */
export const getAllFormasAcervo = async () => {
  const formasAcervo = await prisma.formaAcervo.findMany({
    orderBy: { descricao: 'asc' },
  });
  return formasAcervo;
};

/**
 * Deleta uma forma de acervo.
 */
export const deleteFormaAcervo = async (id: string) => {
  const formaAcervo = await prisma.formaAcervo.findUnique({ where: { id_forma_acervo: id } });
  if (!formaAcervo) {
    throw new NotFoundError('Forma de acervo não encontrada');
  }

  // Verifica se a forma de acervo não está a ser usada em alguma ocorrência
  const ocorrenciasUsando = await prisma.ocorrencia.count({
    where: { id_forma_acervo_fk: id },
  });

  if (ocorrenciasUsando > 0) {
    throw new BadRequestError('Esta forma de acervo não pode ser deletada pois está em uso em Ocorrências.');
  }

  await prisma.formaAcervo.delete({ where: { id_forma_acervo: id } });
};