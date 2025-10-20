// src/services/grupoService.ts (REFATORADO)

import { PrismaClient } from '@prisma/client';
import { NotFoundError, ConflictError } from '../errors/api-errors'; // Importar ConflictError

const prisma = new PrismaClient();

// ... (interfaces, createGrupo e getAllGrupos permanecem inalteradas) ...

/**
 * Deleta um grupo.
 */
export const deleteGrupo = async (id: string) => {
  const grupo = await prisma.grupo.findUnique({ where: { id_grupo: id } });
  if (!grupo) {
    throw new NotFoundError('Grupo não encontrado');
  }

  // Refatorado (4): Usando findFirst para checar se está em uso (performance)
  const subgrupoEmUso = await prisma.subgrupo.findFirst({
    where: { id_grupo_fk: id },
  });

  if (subgrupoEmUso) {
    // Refatorado (5): Usando ConflictError (409)
    throw new ConflictError('Este grupo não pode ser deletado pois está em uso em Subgrupos.');
  }

  await prisma.grupo.delete({ where: { id_grupo: id } });
};