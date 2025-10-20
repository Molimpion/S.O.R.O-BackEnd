// src/services/viaturaService.ts (REFATORADO)

import { PrismaClient, NumeroViatura } from '@prisma/client';
import { NotFoundError, ConflictError } from '../errors/api-errors'; // Importar ConflictError

const prisma = new PrismaClient();

// ... (interfaces, createViatura e getAllViaturas permanecem inalteradas) ...

/**
 * Deleta uma viatura pelo seu número.
 */
export const deleteViatura = async (numero_viatura: NumeroViatura) => {
  const viatura = await prisma.viatura.findUnique({ where: { numero_viatura } });
  if (!viatura) {
    throw new NotFoundError('Viatura não encontrada');
  }

  // Refatorado (4): Usando findFirst para checar se está em uso (performance)
  const ocorrenciaViaturaEmUso = await prisma.ocorrenciaViatura.findFirst({
    where: { id_viatura_fk: numero_viatura },
  });

  if (ocorrenciaViaturaEmUso) {
    // Refatorado (5): Usando ConflictError (409)
    throw new ConflictError('Esta viatura não pode ser deletada pois está associada a ocorrências.');
  }

  await prisma.viatura.delete({ where: { numero_viatura } });
};