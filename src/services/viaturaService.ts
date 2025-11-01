// src/services/viaturaService.ts (COMPLETO E CORRIGIDO)
import { PrismaClient, Prisma } from '@prisma/client'; 
import { NotFoundError, ConflictError } from '../errors/api-errors';

const prisma = new PrismaClient();

interface ViaturaData {
  tipo_vt: string;
  numero_viatura: string;
  id_unidade_operacional_fk: string;
}

export async function createViatura(data: ViaturaData) { 
  // 1. Validar se a unidade operacional existe
  const unidade = await prisma.unidadeOperacional.findUnique({
    where: { id_unidade: data.id_unidade_operacional_fk }
  });
  if (!unidade) {
    throw new NotFoundError('Unidade Operacional associada não encontrada.');
  }

  // 2. Tentar criar a viatura, tratando erro de unicidade
  try {
    const viatura = await prisma.viatura.create({ data });
    return viatura;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      // O campo 'numero_viatura' é @unique
      throw new ConflictError('Já existe uma viatura com este número.');
    }
    throw error;
  }
};

export async function getAllViaturas() { 
  // 3. Implementar listagem
  return await prisma.viatura.findMany({
    orderBy: { numero_viatura: 'asc' },
    include: {
      unidade_operacional: {
        select: {
          id_unidade: true,
          nome_unidade: true
        }
      }
    }
  });
};

// --- 4. FUNÇÃO QUE FALTAVA ---
export async function updateViatura(id: string, data: Partial<ViaturaData>) {
  // 4.1. Garantir que a viatura existe
  const viatura = await prisma.viatura.findUnique({ where: { id_viatura: id } });
  if (!viatura) {
    throw new NotFoundError('Viatura não encontrada.');
  }

  // 4.2. Validar nova unidade operacional, se ela for alterada
  if (data.id_unidade_operacional_fk) {
    const unidade = await prisma.unidadeOperacional.findUnique({
      where: { id_unidade: data.id_unidade_operacional_fk }
    });
    if (!unidade) {
      throw new NotFoundError('Nova Unidade Operacional associada não encontrada.');
    }
  }

  // 4.3. Tentar atualizar, tratando erro de unicidade
  try {
    const updatedViatura = await prisma.viatura.update({
      where: { id_viatura: id },
      data, // O Prisma lida com a atualização parcial (PATCH) ou total (PUT)
    });
    return updatedViatura;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new ConflictError('Já existe uma viatura com este número.');
    }
    throw error;
  }
}
// --- FIM DA FUNÇÃO QUE FALTAVA ---

export async function deleteViatura(id: string) { 
  // 5. Garantir que a viatura existe antes de checar conflitos
  const viatura = await prisma.viatura.findUnique({ where: { id_viatura: id } }); 
  if (!viatura) {
    throw new NotFoundError('Viatura não encontrada');
  }

  // 6. Checar conflitos
  const ocorrenciaViaturaEmUso = await prisma.ocorrenciaViatura.findFirst({
    where: { id_viatura_fk: id }, 
  });

  if (ocorrenciaViaturaEmUso) {
    throw new ConflictError('Esta viatura não pode ser deletada pois está associada a ocorrências.');
  }
  
  // 7. Deletar
  await prisma.viatura.delete({ where: { id_viatura: id } }); 
};