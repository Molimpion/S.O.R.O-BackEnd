// src/services/grupamentoService.ts (REFATORADO)

import { PrismaClient } from '@prisma/client';
import { NotFoundError, ConflictError } from '../errors/api-errors'; // Importar ConflictError

const prisma = new PrismaClient();

// ... (createGrupamento e getAllGrupamentos permanecem inalteradas) ...

/**
 * Deleta um grupamento.
 */
export const deleteGrupamento = async (id: string) => {
  const grupamento = await prisma.grupamento.findUnique({ where: { id_grupamento: id } });
  if (!grupamento) {
    throw new NotFoundError('Grupamento não encontrado');
  }

  // Refatorado (4): Usando findFirst para checar se está em uso (performance)
  const unidadeEmUso = await prisma.unidadeOperacional.findFirst({
    where: { id_grupamento_fk: id },
  });

  if (unidadeEmUso) {
    // Refatorado (5): Usando ConflictError (409)
    throw new ConflictError('Este grupamento não pode ser deletado pois está em uso por Unidades Operacionais.');
  }

  await prisma.grupamento.delete({ where: { id_grupamento: id } });
};