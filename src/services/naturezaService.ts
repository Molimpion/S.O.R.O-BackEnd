// src/services/naturezaService.ts (REFATORADO)

import { PrismaClient, TipoNatureza } from '@prisma/client'; // Importar TipoNatureza
import { NotFoundError, ConflictError } from '../errors/api-errors'; // Importar ConflictError

const prisma = new PrismaClient();

// ... (createNatureza e getAllNaturezas permanecem inalteradas) ...

/**
 * Deleta uma natureza.
 */
export const deleteNatureza = async (id: string) => {
  const natureza = await prisma.natureza.findUnique({ where: { id_natureza: id } });
  if (!natureza) {
    throw new NotFoundError('Natureza não encontrada');
  }

  // Refatorado (4): Usando findFirst para checar se está em uso (performance)
  const grupoEmUso = await prisma.grupo.findFirst({
    where: { id_natureza_fk: id },
  });

  if (grupoEmUso) {
    // Refatorado (5): Usando ConflictError (409)
    throw new ConflictError('Esta natureza não pode ser deletada pois está em uso em Grupos.');
  }

  await prisma.natureza.delete({ where: { id_natureza: id } });
};