import { PrismaClient, NumeroViatura } from '@prisma/client';
import { NotFoundError, BadRequestError } from '../errors/api-errors';

const prisma = new PrismaClient();

interface ViaturaData {
  tipo_vt: string;
  numero_viatura: NumeroViatura;
  id_unidade_operacional_fk: string;
}

/**
 * Cria uma nova viatura, associada a uma Unidade Operacional.
 */
export const createViatura = async (data: ViaturaData) => {
  // Verifica se a Unidade Operacional associada existe
  const unidadeExists = await prisma.unidadeOperacional.findUnique({
    where: { id_unidade: data.id_unidade_operacional_fk },
  });
  if (!unidadeExists) {
    throw new NotFoundError('Unidade Operacional associada não encontrada.');
  }

  return await prisma.viatura.create({ data });
};

/**
 * Retorna todas as viaturas, incluindo a unidade a que pertencem.
 */
export const getAllViaturas = async () => {
  return await prisma.viatura.findMany({
    orderBy: { numero_viatura: 'asc' },
    include: {
      unidade_operacional: true,
    },
  });
};

/**
 * Deleta uma viatura pelo seu número.
 * @param numero_viatura - O número da viatura a ser deletada (a chave primária).
 */
export const deleteViatura = async (numero_viatura: NumeroViatura) => {
  const viatura = await prisma.viatura.findUnique({ where: { numero_viatura } });
  if (!viatura) {
    throw new NotFoundError('Viatura não encontrada');
  }

  // Verifica se a viatura não está a ser usada em alguma ocorrência
  const ocorrenciasUsando = await prisma.ocorrenciaViatura.count({
    where: { id_viatura_fk: numero_viatura },
  });

  if (ocorrenciasUsando > 0) {
    throw new BadRequestError('Esta viatura não pode ser deletada pois está associada a ocorrências.');
  }

  await prisma.viatura.delete({ where: { numero_viatura } });
};