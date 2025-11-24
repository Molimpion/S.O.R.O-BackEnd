// src/services/bairroService.ts

import { PrismaClient } from '@prisma/client';
import { NotFoundError, ConflictError } from '../errors/api-errors';

const prisma = new PrismaClient();

// 1. MODIFICAÇÃO: Adicionar id_municipio_fk à interface
interface BairroData {
  nome_bairro: string;
  regiao?: string;
  ais?: string;
  id_municipio_fk?: string | null; // <-- ADICIONADO (permite nulo para desassociar)
}

/**
 * Cria um novo bairro.
 * Se um 'id_municipio_fk' for fornecido, valida se o município existe.
 */
export async function createBairro(data: BairroData) {
  // Opcional, mas boa prática: Validar se o município existe ANTES de criar
  if (data.id_municipio_fk) {
    const municipio = await prisma.municipio.findUnique({
      where: { id_municipio: data.id_municipio_fk },
    });
    if (!municipio) {
      throw new NotFoundError('Município associado não encontrado.');
    }
  }

  const bairro = await prisma.bairro.create({ data });
  return bairro;
};

/**
 * Retorna todos os bairros, incluindo o município associado.
 */
export async function getAllBairros() {
  const bairros = await prisma.bairro.findMany({
    orderBy: { nome_bairro: 'asc' },
    // 2. MELHORIA: Incluir o município na listagem
    include: {
      municipio: {
        select: {
          id_municipio: true,
          nome_municipio: true
        }
      }
    }
  });
  return bairros;
};

/**
 * Busca um bairro específico pelo ID, incluindo o município.
 */
export async function getBairroById(id: string) {
  const bairro = await prisma.bairro.findUnique({ 
    where: { id_bairro: id },
    // 3. MELHORIA: Incluir o município na busca por ID
    include: {
      municipio: true
    }
  });
  if (!bairro) {
    throw new NotFoundError('Bairro não encontrado');
  }
  return bairro;
};

/**
 * Atualiza um bairro.
 * O 'data' agora aceita 'id_municipio_fk' para associar ou alterar o município.
 */
export async function updateBairro(id: string, data: Partial<BairroData>) {
  await getBairroById(id); // Garante que o bairro existe

  // Opcional, mas boa prática: Validar o município se ele estiver sendo alterado
  if (data.id_municipio_fk) {
    const municipio = await prisma.municipio.findUnique({
      where: { id_municipio: data.id_municipio_fk },
    });
    if (!municipio) {
      throw new NotFoundError('Município associado não encontrado.');
    }
  }

  const updatedBairro = await prisma.bairro.update({
    where: { id_bairro: id },
    data, // 'data' pode conter { nome_bairro, regiao, ais, id_municipio_fk }
  });
  return updatedBairro;
};

/**
 * Deleta um bairro, verificando se não está em uso em ocorrências.
 */
export async function deleteBairro(id: string) {
  await getBairroById(id); // Garante que o bairro existe

  const ocorrenciaEmUso = await prisma.ocorrencia.findFirst({
    where: { id_bairro_fk: id },
  });

  if (ocorrenciaEmUso) {
    throw new ConflictError('Este bairro não pode ser deletado pois está em uso em ocorrências.');
  }
  
  await prisma.bairro.delete({ where: { id_bairro: id } });
};