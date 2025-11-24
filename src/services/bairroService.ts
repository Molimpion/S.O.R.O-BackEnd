import { PrismaClient } from "@prisma/client";
import { NotFoundError, ConflictError } from "../errors/api-errors";

const prisma = new PrismaClient();

interface BairroData {
  nome_bairro: string;
  regiao?: string;
  ais?: string;
  id_municipio_fk?: string | null;
}

export async function createBairro(data: BairroData) {
  if (data.id_municipio_fk) {
    const municipio = await prisma.municipio.findUnique({
      where: { id_municipio: data.id_municipio_fk },
    });
    if (!municipio) {
      throw new NotFoundError("Município associado não encontrado.");
    }
  }

  const bairro = await prisma.bairro.create({ data });
  return bairro;
}

export async function getAllBairros() {
  const bairros = await prisma.bairro.findMany({
    orderBy: { nome_bairro: "asc" },

    include: {
      municipio: {
        select: {
          id_municipio: true,
          nome_municipio: true,
        },
      },
    },
  });
  return bairros;
}

export async function getBairroById(id: string) {
  const bairro = await prisma.bairro.findUnique({
    where: { id_bairro: id },

    include: {
      municipio: true,
    },
  });
  if (!bairro) {
    throw new NotFoundError("Bairro não encontrado");
  }
  return bairro;
}

export async function updateBairro(id: string, data: Partial<BairroData>) {
  await getBairroById(id);

  if (data.id_municipio_fk) {
    const municipio = await prisma.municipio.findUnique({
      where: { id_municipio: data.id_municipio_fk },
    });
    if (!municipio) {
      throw new NotFoundError("Município associado não encontrado.");
    }
  }

  const updatedBairro = await prisma.bairro.update({
    where: { id_bairro: id },
    data,
  });
  return updatedBairro;
}

export async function deleteBairro(id: string) {
  await getBairroById(id);

  const ocorrenciaEmUso = await prisma.ocorrencia.findFirst({
    where: { id_bairro_fk: id },
  });

  if (ocorrenciaEmUso) {
    throw new ConflictError(
      "Este bairro não pode ser deletado pois está em uso em ocorrências."
    );
  }

  await prisma.bairro.delete({ where: { id_bairro: id } });
}
