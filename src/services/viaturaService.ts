// src/services/viaturaService.ts (CORRIGIDO: Sintaxe, PK e Tipagem)
import { PrismaClient } from '@prisma/client'; 
import { NotFoundError, ConflictError } from '../errors/api-errors';

const prisma = new PrismaClient();
// ... (restante do código igual)

export async function deleteViatura(id: string) {
  // CORREÇÃO: Usa o novo PK id_viatura para busca
  const viatura = await prisma.viatura.findUnique({ where: { id_viatura: id } }); 
  if (!viatura) {
    throw new NotFoundError('Viatura não encontrada');
  }
  // ... (lógica de checagem de uso) ...
  const ocorrenciaViaturaEmUso = await prisma.ocorrenciaViatura.findFirst({
    where: { id_viatura_fk: id }, 
  });
  if (ocorrenciaViaturaEmUso) {
    throw new ConflictError('Esta viatura não pode ser deletada pois está associada a ocorrências.');
  }
  // CORREÇÃO: Usa o novo PK id_viatura para deleção
  await prisma.viatura.delete({ where: { id_viatura: id } }); 
};