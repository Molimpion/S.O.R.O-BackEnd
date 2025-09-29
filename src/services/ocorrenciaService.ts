// src/services/ocorrenciaService.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// TODO: Implementar a lógica para listar ocorrências
export const getAllOcorrencias = async () => {
  // A lógica virá aqui quando o modelo estiver pronto
  return { message: "Função de listar ocorrências ainda não implementada." };
};

// TODO: Implementar a lógica para criar uma ocorrência
export const createOcorrencia = async (data: any) => {
  // A lógica virá aqui
  return { message: "Função de criar ocorrência ainda não implementada." };
};

// ...outras funções virão aqui (buscar por id, atualizar, deletar)