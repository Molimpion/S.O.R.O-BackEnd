// src/services/formaAcervoService.ts (REFATORADO)

import { PrismaClient } from '@prisma/client';
import { NotFoundError, ConflictError } from '../errors/api-errors'; // Importar ConflictError

const prisma = new PrismaClient();

// ... (createFormaAcervo e getAllFormasAcervo permanecem inalteradas) ...

/**
 * Deleta uma forma de acervo.
 */
export const deleteFormaAcervo = async (id: string) => {
  const formaAcervo = await prisma.formaAcervo.findUnique({ where: { id_forma_acervo: id } });
  if (!formaAcervo) {
    throw new NotFoundError('Forma de acervo não encontrada');
  }

  // Refatorado (4): Usando findFirst para checar se está em uso (performance)
  const ocorrenciaEmUso = await prisma.ocorrencia.findFirst({
    where: { id_forma_acervo_fk: id },
  });

  if (ocorrenciaEmUso) {
    // Refatorado (5): Usando ConflictError (409)
    throw new ConflictError('Esta forma de acervo não pode ser deletada pois está em uso em Ocorrências.');
  }

  await prisma.formaAcervo.delete({ where: { id_forma_acervo: id } });
};