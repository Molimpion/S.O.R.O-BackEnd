import { PrismaClient } from "@prisma/client";
import { NotFoundError, ConflictError } from "../errors/api-errors";

const prisma = new PrismaClient();

interface SubgrupoData {
  descricao_subgrupo: string;
  id_grupo_fk: string;
}

interface SubgrupoFilters {
  grupoId?: string;
}

export async function createSubgrupo(data: SubgrupoData) {
  const grupoExists = await prisma.grupo.findUnique({
    where: { id_grupo: data.id_grupo_fk },
  });
  if (!grupoExists) {
    throw new NotFoundError("Grupo associado não encontrado.");
  }

  const subgrupo = await prisma.subgrupo.create({ data });
  return subgrupo;
}

export async function getAllSubgrupos(filters?: SubgrupoFilters) {
  const where: any = {};

  if (filters?.grupoId) {
    where.id_grupo_fk = filters.grupoId;
  }

  const subgrupos = await prisma.subgrupo.findMany({
    where,
    orderBy: { descricao_subgrupo: "asc" },
    include: {
      grupo: {
        include: {
          natureza: true,
        },
      },
    },
  });
  return subgrupos;
}

export async function deleteSubgrupo(id: string) {
  const subgrupo = await prisma.subgrupo.findUnique({
    where: { id_subgrupo: id },
  });
  if (!subgrupo) {
    throw new NotFoundError("Subgrupo não encontrado");
  }

  const ocorrenciasUsando = await prisma.ocorrencia.findFirst({
    where: { id_subgrupo_fk: id },
  });

  if (ocorrenciasUsando) {
    throw new ConflictError(
      "Este subgrupo não pode ser deletado pois está em uso em Ocorrências."
    );
  }

  await prisma.subgrupo.delete({ where: { id_subgrupo: id } });
}
