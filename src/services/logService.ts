// src/services/logService.ts

import { PrismaClient, ActionType } from '@prisma/client';

const prisma = new PrismaClient();

// Definimos uma interface para estruturar os dados do log que vamos receber
interface LogData {
  action: ActionType; // A ação que foi realizada (vem do nosso enum)
  userId?: string;     // O ID do usuário que fez a ação (opcional)
  details?: string;    // Detalhes extras sobre o evento
  ipAddress?: string;  // Endereço IP (opcional)
}

/**
 * Função principal para criar um novo registro de log no banco de dados.
 * @param logData - Um objeto contendo as informações do log a ser criado.
 */
export const createLog = async (logData: LogData) => {
  try {
    await prisma.auditLog.create({
      data: {
        action: logData.action,
        details: logData.details,
        ipAddress: logData.ipAddress,
        // Conecta o log ao usuário, se um userId for fornecido
        userId: logData.userId,
      },
    });
  } catch (error) {
    // Em um sistema real, poderíamos ter um log de erros mais robusto aqui
    // Por enquanto, apenas exibimos o erro no console
    console.error("Falha ao criar log de auditoria:", error);
  }
};