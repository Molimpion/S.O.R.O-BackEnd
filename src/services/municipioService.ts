import { PrismaClient } from '@prisma/client';
import { NotFoundError, BadRequestError } from '../errors/api-errors';

const prisma = new PrismaClient();

interface MunicipioData {
  nome_municipio: string;
  regiao?: string;
  ais?: string;
}

/**
 * Cria um novo município.
 */
export const createMunicipio = async (data: MunicipioData) => {
  const municipio = await prisma.municipio.create({ data });
  return municipio;
};

/**
 * Retorna todos os municípios.
 */
export const getAllMunicipios = async () => {
  const municipios = await prisma.municipio.findMany({
    orderBy: {
      nome_municipio: 'asc',
    },
  });
  return municipios;
};

/**
 * Busca um município pelo seu ID.
 */
export const getMunicipioById = async (id: string) => {
  const municipio = await prisma.municipio.findUnique({
    where: { id_municipio: id },
  });

  if (!municipio) {
    throw new NotFoundError('Município não encontrado');
  }
  return municipio;
};

/**
 * Atualiza um município existente.
 */
export const updateMunicipio = async (id: string, data: Partial<MunicipioData>) => {
  // Verifica se o município existe antes de tentar atualizar
  await getMunicipioById(id);
  
  const updatedMunicipio = await prisma.municipio.update({
    where: { id_municipio: id },
    data,
  });
  return updatedMunicipio;
};

/**
 * Deleta um município.
 */
export const deleteMunicipio = async (id: string) => {
  // Verifica se o município existe antes de tentar deletar
  await getMunicipioById(id);

  // Verifica se o município não está sendo usado em alguma ocorrência
  const ocorrenciasUsando = await prisma.ocorrencia.count({
    where: { id_municipio_fk: id },
  });

  if (ocorrenciasUsando > 0) {
    throw new BadRequestError('Este município não pode ser deletado pois está em uso em ocorrências.');
  }

  await prisma.municipio.delete({
    where: { id_municipio: id },
  });
};
