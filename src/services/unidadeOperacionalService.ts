import { PrismaClient } from '@prisma/client';
import { NotFoundError, BadRequestError } from '../errors/api-errors';

const prisma = new PrismaClient();

interface UnidadeData {
  nome_unidade: string;
  endereco_base?: string;
  id_grupamento_fk: string;
}

/**
 * Cria uma nova Unidade Operacional.
 */
export const createUnidade = async (data: UnidadeData) => {
  const grupamentoExists = await prisma.grupamento.findUnique({
    where: { id_grupamento: data.id_grupamento_fk },
  });
  if (!grupamentoExists) {
    throw new NotFoundError('Grupamento associado não encontrado.');
  }

  return await prisma.unidadeOperacional.create({ data });
};

/**
 * Retorna todas as Unidades Operacionais.
 */
export const getAllUnidades = async () => {
  return await prisma.unidadeOperacional.findMany({
    orderBy: { nome_unidade: 'asc' },
    include: { grupamento: true },
  });
};

/**
 * Deleta uma Unidade Operacional.
 */
export const deleteUnidade = async (id: string) => {
  const unidade = await prisma.unidadeOperacional.findUnique({ where: { id_unidade: id } });
  if (!unidade) {
    throw new NotFoundError('Unidade Operacional não encontrada');
  }

  const usuariosUsando = await prisma.user.count({ where: { id_unidade_operacional_fk: id } });
  if (usuariosUsando > 0) {
    throw new BadRequestError('Esta unidade não pode ser deletada pois possui usuários associados.');
  }

  const viaturasUsando = await prisma.viatura.count({ where: { id_unidade_operacional_fk: id } });
  if (viaturasUsando > 0) {
    throw new BadRequestError('Esta unidade não pode ser deletada pois possui viaturas associadas.');
  }

  await prisma.unidadeOperacional.delete({ where: { id_unidade: id } });
};