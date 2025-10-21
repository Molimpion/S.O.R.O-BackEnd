import { PrismaClient } from '@prisma/client';
import { NotFoundError, ConflictError } from '../errors/api-errors';

const prisma = new PrismaClient();

interface UnidadeData {
  nome_unidade: string;
  endereco_base?: string;
  id_grupamento_fk: string;
}

export async function createUnidade(data: UnidadeData) {
  const grupamentoExists = await prisma.grupamento.findUnique({
    where: { id_grupamento: data.id_grupamento_fk },
  });
  if (!grupamentoExists) {
    throw new NotFoundError('Grupamento associado não encontrado.');
  }

  return await prisma.unidadeOperacional.create({ data });
};

export async function getAllUnidades() {
  return await prisma.unidadeOperacional.findMany({
    orderBy: { nome_unidade: 'asc' },
    include: { grupamento: true },
  });
};

export async function deleteUnidade(id: string) {
  const unidade = await prisma.unidadeOperacional.findUnique({ where: { id_unidade: id } });
  if (!unidade) {
    throw new NotFoundError('Unidade Operacional não encontrada');
  }

  const usuarioEmUso = await prisma.user.findFirst({ where: { id_unidade_operacional_fk: id } });
  if (usuarioEmUso) {
    throw new ConflictError('Esta unidade não pode ser deletada pois possui usuários associados.');
  }

  const viaturaEmUso = await prisma.viatura.findFirst({ where: { id_unidade_operacional_fk: id } });
  if (viaturaEmUso) {
    throw new ConflictError('Esta unidade não pode ser deletada pois possui viaturas associadas.');
  }

  await prisma.unidadeOperacional.delete({ where: { id_unidade: id } });
};