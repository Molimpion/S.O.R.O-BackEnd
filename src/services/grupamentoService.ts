// src/services/grupamentoService.ts (CORRIGIDO: Mapeamento de Erro de Unicidade)
import { PrismaClient, Prisma } from '@prisma/client'; // <-- Importado 'Prisma' para tipos de erro
import { NotFoundError, ConflictError } from '../errors/api-errors';

const prisma = new PrismaClient();

// DTO para garantir a tipagem forte
interface GrupamentoData {
  nome_grupamento: string;
  sigla: string;
}

export async function createGrupamento(data: GrupamentoData) { 
  try {
    // A. Tenta criar o recurso
    return await prisma.grupamento.create({ data });
  } catch (error) {
    // B. Mapeamento de Erro do Prisma (Princípio SRP)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2002 é o código para Unique constraint violation (sigla ou nome_grupamento)
      if (error.code === 'P2002') {
        // Lançamos um 409 Conflict, o status HTTP correto para este caso.
        throw new ConflictError('Já existe um Grupamento com a Sigla ou Nome fornecido.');
      }
    }
    // C. Repassa outros erros desconhecidos ou erros customizados.
    throw error;
  }
};

export async function getAllGrupamentos() {
  return await prisma.grupamento.findMany({
    orderBy: { nome_grupamento: 'asc' },
  });
};

export async function deleteGrupamento(id: string) {
  const grupamento = await prisma.grupamento.findUnique({ where: { id_grupamento: id } });
  if (!grupamento) {
    throw new NotFoundError('Grupamento não encontrado');
  }

  const unidadeEmUso = await prisma.unidadeOperacional.findFirst({
    where: { id_grupamento_fk: id },
  });

  if (unidadeEmUso) {
    throw new ConflictError('Este grupamento não pode ser deletado pois está em uso por Unidades Operacionais.');
  }

  await prisma.grupamento.delete({ where: { id_grupamento: id } });
};