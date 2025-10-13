import { PrismaClient } from '@prisma/client';
import { NotFoundError, BadRequestError } from '../errors/api-errors';

const prisma = new PrismaClient();

interface GrupoData {
  descricao_grupo: string;
  id_natureza_fk: string;
}

/**
 * Cria um novo grupo, associado a uma natureza.
 */
export const createGrupo = async (data: GrupoData) => {
  // Verifica se a natureza associada existe
  const naturezaExists = await prisma.natureza.findUnique({
    where: { id_natureza: data.id_natureza_fk },
  });
  if (!naturezaExists) {
    throw new NotFoundError('Natureza associada não encontrada.');
  }

  const grupo = await prisma.grupo.create({ data });
  return grupo;
};

/**
 * Retorna todos os grupos, incluindo a natureza a que pertencem.
 */
export const getAllGrupos = async () => {
  const grupos = await prisma.grupo.findMany({
    orderBy: { descricao_grupo: 'asc' },
    include: {
      natureza: true, // Inclui os dados da natureza relacionada
    },
  });
  return grupos;
};

/**
 * Deleta um grupo.
 */
export const deleteGrupo = async (id: string) => {
  const grupo = await prisma.grupo.findUnique({ where: { id_grupo: id } });
  if (!grupo) {
    throw new NotFoundError('Grupo não encontrado');
  }

  // Verifica se o grupo não está sendo usado em algum subgrupo
  const subgruposUsando = await prisma.subgrupo.count({
    where: { id_grupo_fk: id },
  });

  if (subgruposUsando > 0) {
    throw new BadRequestError('Este grupo não pode ser deletado pois está em uso em Subgrupos.');
  }

  await prisma.grupo.delete({ where: { id_grupo: id } });
};