import { PrismaClient, Prisma } from '@prisma/client'; // Importar Prisma
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

  try {
    return await prisma.unidadeOperacional.create({ data });
  } catch (error) {
    // Nota: 'nome_unidade' não é unique no schema, mas 'sigla' de grupamento era.
    // Se 'nome_unidade' se tornar unique, este código tratará.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
       throw new ConflictError('Já existe uma Unidade Operacional com este nome.');
    }
    throw error;
  }
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