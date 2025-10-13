// src/services/ocorrenciaService.ts (AJUSTADO PARA SEGURANÇA E TIPAGEM)
import { PrismaClient } from '@prisma/client';
import { BadRequestError } from '../errors/api-errors';

const prisma = new PrismaClient();

// A interface agora não espera mais o ID do usuário que abriu
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
 * @param data - Os dados da ocorrência a ser criada.
 * @param userId - O ID do usuário logado que está criando a ocorrência.
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
      // AQUI ESTÁ A MUDANÇA: Usamos o ID do usuário vindo do token
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