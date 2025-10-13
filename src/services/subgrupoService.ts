import { PrismaClient } from '@prisma/client';
import { NotFoundError, BadRequestError } from '../errors/api-errors';

const prisma = new PrismaClient();

interface SubgrupoData {
  descricao_subgrupo: string;
  id_grupo_fk: string;
}

/**
 * Cria um novo subgrupo, associado a um grupo.
 */
export const createSubgrupo = async (data: SubgrupoData) => {
  // Verifica se o grupo associado existe
  const grupoExists = await prisma.grupo.findUnique({
    where: { id_grupo: data.id_grupo_fk },
  });
  if (!grupoExists) {
    throw new NotFoundError('Grupo associado não encontrado.');
  }

  const subgrupo = await prisma.subgrupo.create({ data });
  return subgrupo;
};

/**
 * Retorna todos os subgrupos, incluindo o grupo e a natureza a que pertencem.
 */
export const getAllSubgrupos = async () => {
  const subgrupos = await prisma.subgrupo.findMany({
    orderBy: { descricao_subgrupo: 'asc' },
    include: {
      grupo: {
        include: {
          natureza: true, // Inclui também os dados da natureza
        },
      },
    },
  });
  return subgrupos;
};

/**
 * Deleta um subgrupo.
 */
export const deleteSubgrupo = async (id: string) => {
  const subgrupo = await prisma.subgrupo.findUnique({ where: { id_subgrupo: id } });
  if (!subgrupo) {
    throw new NotFoundError('Subgrupo não encontrado');
  }

  // Verifica se o subgrupo não está sendo usado em alguma ocorrência
  const ocorrenciasUsando = await prisma.ocorrencia.count({
    where: { id_subgrupo_fk: id },
  });

  if (ocorrenciasUsando > 0) {
    throw new BadRequestError('Este subgrupo não pode ser deletado pois está em uso em Ocorrências.');
  }

  await prisma.subgrupo.delete({ where: { id_subgrupo: id } });
};