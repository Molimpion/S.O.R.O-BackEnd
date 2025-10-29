import { PrismaClient, Prisma } from '@prisma/client';
import { NotFoundError, ConflictError } from '../errors/api-errors';

const prisma = new PrismaClient();

interface MunicipioData {
  nome_municipio: string;
}

export async function createMunicipio(data: MunicipioData) {
  try {
    const municipio = await prisma.municipio.create({
      data: {
        nome_municipio: data.nome_municipio,
      },
    });
    return municipio;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002' && error.meta?.target === 'municipios_nome_municipio_key') {
        throw new ConflictError('Já existe um município com este nome.');
      }
    }
    throw error; // Re-lança outros erros
  }
}

export async function getAllMunicipios() {
  const municipios = await prisma.municipio.findMany({
    orderBy: { nome_municipio: 'asc' },
  });
  return municipios;
}

export async function getMunicipioById(id: string) {
  const municipio = await prisma.municipio.findUnique({
    where: { id_municipio: id },
  });
  if (!municipio) {
    throw new NotFoundError('Município não encontrado');
  }
  return municipio;
}

// Opcional: Função de atualização
export async function updateMunicipio(id: string, data: Partial<MunicipioData>) {
  await getMunicipioById(id); // Garante que o município existe
  try {
    const updatedMunicipio = await prisma.municipio.update({
      where: { id_municipio: id },
      data: {
        nome_municipio: data.nome_municipio, // Atualiza apenas os campos fornecidos
      },
    });
    return updatedMunicipio;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002' && error.meta?.target === 'municipios_nome_municipio_key') {
        throw new ConflictError('Já existe um município com este nome.');
      }
    }
    throw error;
  }
}

export async function deleteMunicipio(id: string) {
  await getMunicipioById(id); // Garante que o município existe

  // Verifica se algum bairro está usando este município
  const bairroEmUso = await prisma.bairro.findFirst({
    where: { id_municipio_fk: id },
  });

  if (bairroEmUso) {
    throw new ConflictError('Este município não pode ser deletado pois está associado a bairros.');
  }

  // Se nenhum bairro estiver usando, pode deletar
  await prisma.municipio.delete({
    where: { id_municipio: id },
  });
}