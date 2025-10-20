// src/services/viaturaService.ts (FINAL)

import { PrismaClient } from '@prisma/client'; 
import { NotFoundError, ConflictError } from '../errors/api-errors';

const prisma = new PrismaClient();

interface ViaturaData {
  tipo_vt: string;
  numero_viatura: string; // Tipo correto
  id_unidade_operacional_fk: string;
}

export async function createViatura(data: ViaturaData) { 
  // ... (lógica de criação)
};

export async function getAllViaturas() { 
  // ... (lógica de leitura)
};

export async function deleteViatura(id: string) { 
  // Busca pelo novo PK id_viatura
  const viatura = await prisma.viatura.findUnique({ where: { id_viatura: id } }); 
  if (!viatura) {
    throw new NotFoundError('Viatura não encontrada');
  }

  // Lógica de checagem de uso (usando id_viatura)
  const ocorrenciaViaturaEmUso = await prisma.ocorrenciaViatura.findFirst({
    where: { id_viatura_fk: id }, 
  });

  if (ocorrenciaViaturaEmUso) {
    throw new ConflictError('Esta viatura não pode ser deletada pois está associada a ocorrências.');
  }

  // Deleta pelo novo PK
  await prisma.viatura.delete({ where: { id_viatura: id } }); 
};