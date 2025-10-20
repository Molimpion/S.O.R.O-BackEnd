// src/services/subgrupoService.ts (REFATORADO)

import { PrismaClient } from '@prisma/client';
import { NotFoundError, ConflictError } from '../errors/api-errors'; // Importar ConflictError

const prisma = new PrismaClient();

// ... (createSubgrupo e getAllSubgrupos permanecem inalteradas) ...

/**
 * Deleta um subgrupo.
 */
export const deleteSubgrupo = async (id: string) => {
  const subgrupo = await prisma.subgrupo.findUnique({ where: { id_subgrupo: id } });
  if (!subgrupo) {
    throw new NotFoundError('Subgrupo não encontrado');
  }

  // Refatorado (4): Usando findFirst para checar se está em uso (performance)
  const ocorrenciaEmUso = await prisma.ocorrencia.findFirst({
    where: { id_subgrupo_fk: id },
  });

  if (ocorrenciaEmUso) {
    // Refatorado (5): Usando ConflictError (409)
    throw new ConflictError('Este subgrupo não pode ser deletado pois está em uso em Ocorrências.');
  }

  await prisma.subgrupo.delete({ where: { id_subgrupo: id } });
};