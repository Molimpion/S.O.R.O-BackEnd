// src/services/unidadeOperacionalService.ts (REFATORADO)

import { PrismaClient } from '@prisma/client';
import { NotFoundError, ConflictError } from '../errors/api-errors'; // Importar ConflictError

const prisma = new PrismaClient();

// ... (interfaces, createUnidade e getAllUnidades permanecem inalteradas) ...

/**
 * Deleta uma Unidade Operacional.
 */
export const deleteUnidade = async (id: string) => {
  const unidade = await prisma.unidadeOperacional.findUnique({ where: { id_unidade: id } });
  if (!unidade) {
    throw new NotFoundError('Unidade Operacional não encontrada');
  }

  // Refatorado (4): Usando findFirst para checar se há usuários ou viaturas em uso
  const usuarioEmUso = await prisma.user.findFirst({ where: { id_unidade_operacional_fk: id } });
  if (usuarioEmUso) {
    // Refatorado (5): Usando ConflictError (409)
    throw new ConflictError('Esta unidade não pode ser deletada pois possui usuários associados.');
  }

  const viaturaEmUso = await prisma.viatura.findFirst({ where: { id_unidade_operacional_fk: id } });
  if (viaturaEmUso) {
    // Refatorado (5): Usando ConflictError (409)
    throw new ConflictError('Esta unidade não pode ser deletada pois possui viaturas associadas.');
  }

  await prisma.unidadeOperacional.delete({ where: { id_unidade: id } });
};