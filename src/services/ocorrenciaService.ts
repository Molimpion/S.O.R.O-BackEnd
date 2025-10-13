// src/services/ocorrenciaService.ts (ATUALIZADO)

import { PrismaClient } from '@prisma/client';
// Adicionamos o NotFoundError para usar na nova função
import { BadRequestError, NotFoundError } from '../errors/api-errors';

const prisma = new PrismaClient();

interface CreateOcorrenciaData {
  data_acionamento: string | Date;
  hora_acionamento: string | Date;
  id_subgrupo_fk: string;
  id_municipio_fk: string;
  id_forma_acervo_fk: string;
  nr_aviso?: string;
}

/**
 * Cria uma nova ocorrência no banco de dados.
 */
export const createOcorrencia = async (data: CreateOcorrenciaData, userId: string) => {
  if (!data.id_subgrupo_fk || !data.id_municipio_fk || !data.id_forma_acervo_fk) {
    throw new BadRequestError('Faltam IDs de relacionamento obrigatórios para criar a ocorrência.');
  }

  const novaOcorrencia = await prisma.ocorrencia.create({
    data: {
      ...data,
      data_acionamento: new Date(data.data_acionamento),
      hora_acionamento: new Date(data.hora_acionamento),
      id_usuario_abertura_fk: userId,
    },
  });

  return novaOcorrencia;
};

/**
 * Lista todas as ocorrências existentes.
 */
export const getAllOcorrencias = async () => {
  const ocorrencias = await prisma.ocorrencia.findMany({
    orderBy: {
      carimbo_data_hora_abertura: 'desc',
    },
    include: {
      subgrupo: true,
      municipio: true,
      usuario_abertura: {
        select: {
          id: true,
          nome: true,
          nome_guerra: true,
        },
      },
    },
  });

  return ocorrencias;
};


// =============================================================
// ============ NOVA FUNÇÃO ADICIONADA ABAIXO ==================
// =============================================================

/**
 * Busca uma ocorrência específica pelo seu ID, incluindo todos os dados relacionados.
 * @param id - O ID da ocorrência a ser buscada.
 */
export const getOcorrenciaById = async (id: string) => {
  const ocorrencia = await prisma.ocorrencia.findUnique({
    where: {
      // O nome do campo de ID no nosso model Ocorrencia é 'id_ocorrencia'
      id_ocorrencia: id,
    },
    // O 'include' busca os dados das tabelas relacionadas, enriquecendo o resultado
    include: {
      subgrupo: true,
      municipio: true,
      forma_acervo: true,
      usuario_abertura: {
        select: { id: true, nome: true, nome_guerra: true, posto_grad: true },
      },
      localizacao: true,
      vitimas: true,
      midias: true,
      viaturas_usadas: {
        include: {
          viatura: true, // Traz os detalhes da viatura (tipo, número)
        },
      },
      equipe_ocorrencia: {
        include: {
          usuario: { // Traz os detalhes do bombeiro na equipe
            select: { id: true, nome: true, nome_guerra: true, posto_grad: true },
          },
        },
      },
    },
  });

  // Se a ocorrência não for encontrada, lançamos nosso erro customizado
  if (!ocorrencia) {
    throw new NotFoundError('Ocorrência não encontrada');
  }

  return ocorrencia;
};