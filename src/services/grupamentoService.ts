import { PrismaClient, Prisma } from "@prisma/client";
import { NotFoundError, ConflictError } from "../errors/api-errors";

const prisma = new PrismaClient();

interface GrupamentoData {
  nome_grupamento: string;
  sigla: string;
}

export async function createGrupamento(data: GrupamentoData) {
  try {
    return await prisma.grupamento.create({ data });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new ConflictError(
          "Já existe um Grupamento com a Sigla ou Nome fornecido."
        );
      }
    }

    throw error;
  }
}

export async function getAllGrupamentos() {
  return await prisma.grupamento.findMany({
    orderBy: { nome_grupamento: "asc" },
  });
}

export async function deleteGrupamento(id: string) {
  const grupamento = await prisma.grupamento.findUnique({
    where: { id_grupamento: id },
  });
  if (!grupamento) {
    throw new NotFoundError("Grupamento não encontrado");
  }

  const unidadeEmUso = await prisma.unidadeOperacional.findFirst({
    where: { id_grupamento_fk: id },
  });

  if (unidadeEmUso) {
    throw new ConflictError(
      "Este grupamento não pode ser deletado pois está em uso por Unidades Operacionais."
    );
  }

  await prisma.grupamento.delete({ where: { id_grupamento: id } });
}
