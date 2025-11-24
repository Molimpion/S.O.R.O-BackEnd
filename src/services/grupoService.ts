import { PrismaClient } from "@prisma/client";
import { NotFoundError, ConflictError } from "../errors/api-errors";

const prisma = new PrismaClient();

interface GrupoData {
  descricao_grupo: string;
  id_natureza_fk: string;
}

interface GrupoFilters {
  naturezaId?: string;
}

export async function createGrupo(data: GrupoData) {
  const naturezaExists = await prisma.natureza.findUnique({
    where: { id_natureza: data.id_natureza_fk },
  });
  if (!naturezaExists) {
    throw new NotFoundError("Natureza associada não encontrada.");
  }

  const grupo = await prisma.grupo.create({ data });
  return grupo;
}

export async function getAllGrupos(filters?: GrupoFilters) {
  const where: any = {};

  if (filters?.naturezaId) {
    where.id_natureza_fk = filters.naturezaId;
  }

  const grupos = await prisma.grupo.findMany({
    where,
    orderBy: { descricao_grupo: "asc" },
    include: {
      natureza: true,
    },
  });
  return grupos;
}

export async function deleteGrupo(id: string) {
  const grupo = await prisma.grupo.findUnique({ where: { id_grupo: id } });
  if (!grupo) {
    throw new NotFoundError("Grupo não encontrado");
  }

  const subgrupoEmUso = await prisma.subgrupo.findFirst({
    where: { id_grupo_fk: id },
  });

  if (subgrupoEmUso) {
    throw new ConflictError(
      "Este grupo não pode ser deletado pois está em uso em Subgrupos."
    );
  }

  await prisma.grupo.delete({ where: { id_grupo: id } });
}
