import { PrismaClient, Prisma } from "@prisma/client";
import { NotFoundError, ConflictError } from "../errors/api-errors";

const prisma = new PrismaClient();

interface ViaturaData {
  tipo_vt: string;
  numero_viatura: string;
  id_unidade_operacional_fk: string;
}

export async function createViatura(data: ViaturaData) {
  const unidade = await prisma.unidadeOperacional.findUnique({
    where: { id_unidade: data.id_unidade_operacional_fk },
  });
  if (!unidade) {
    throw new NotFoundError("Unidade Operacional associada não encontrada.");
  }

  try {
    const viatura = await prisma.viatura.create({ data });
    return viatura;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ConflictError("Já existe uma viatura com este número.");
    }
    throw error;
  }
}

export async function getAllViaturas() {
  return await prisma.viatura.findMany({
    orderBy: { numero_viatura: "asc" },
    include: {
      unidade_operacional: {
        select: {
          id_unidade: true,
          nome_unidade: true,
        },
      },
    },
  });
}

export async function updateViatura(id: string, data: Partial<ViaturaData>) {
  const viatura = await prisma.viatura.findUnique({
    where: { id_viatura: id },
  });
  if (!viatura) {
    throw new NotFoundError("Viatura não encontrada.");
  }

  if (data.id_unidade_operacional_fk) {
    const unidade = await prisma.unidadeOperacional.findUnique({
      where: { id_unidade: data.id_unidade_operacional_fk },
    });
    if (!unidade) {
      throw new NotFoundError(
        "Nova Unidade Operacional associada não encontrada."
      );
    }
  }

  try {
    const updatedViatura = await prisma.viatura.update({
      where: { id_viatura: id },
      data,
    });
    return updatedViatura;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ConflictError("Já existe uma viatura com este número.");
    }
    throw error;
  }
}

export async function deleteViatura(id: string) {
  const viatura = await prisma.viatura.findUnique({
    where: { id_viatura: id },
  });
  if (!viatura) {
    throw new NotFoundError("Viatura não encontrada");
  }

  const ocorrenciaViaturaEmUso = await prisma.ocorrenciaViatura.findFirst({
    where: { id_viatura_fk: id },
  });

  if (ocorrenciaViaturaEmUso) {
    throw new ConflictError(
      "Esta viatura não pode ser deletada pois está associada a ocorrências."
    );
  }

  await prisma.viatura.delete({ where: { id_viatura: id } });
}
