import { PrismaClient } from '@prisma/client';
import { NotFoundError, ConflictError } from '../errors/api-errors';

const prisma = new PrismaClient();

export async function createFormaAcervo(descricao: string) {
  const formaAcervo = await prisma.formaAcervo.create({
    data: { descricao },
  });
  return formaAcervo;
};

export async function getAllFormasAcervo() {
  const formasAcervo = await prisma.formaAcervo.findMany({
    orderBy: { descricao: 'asc' },
  });
  return formasAcervo;
};

export async function deleteFormaAcervo(id: string) {
  const formaAcervo = await prisma.formaAcervo.findUnique({ where: { id_forma_acervo: id } });
  if (!formaAcervo) {
    throw new NotFoundError('Forma de acervo não encontrada');
  }

  const ocorrenciasUsando = await prisma.ocorrencia.findFirst({
    where: { id_forma_acervo_fk: id },
  });

  if (ocorrenciasUsando) {
    throw new ConflictError('Esta forma de acervo não pode ser deletada pois está em uso em Ocorrências.');
  }

  await prisma.formaAcervo.delete({ where: { id_forma_acervo: id } });
};