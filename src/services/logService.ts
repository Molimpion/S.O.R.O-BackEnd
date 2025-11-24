// src/services/logService.ts
import { PrismaClient, ActionType } from '@prisma/client';
import { logger } from '../configs/logger'; // <-- 1. Importar o logger

const prisma = new PrismaClient();

interface LogData {
  action: ActionType;
  userId?: string;
  details?: string;
  ipAddress?: string;
}

export const createLog = async (logData: LogData) => {
  try {
    await prisma.auditLog.create({
      data: {
        action: logData.action,
        details: logData.details,
        ipAddress: logData.ipAddress,
        userId: logData.userId,
      },
    });
  } catch (error) {
    // --- 2. Modificação do bloco catch ---
    // Substitui console.error pelo logger estruturado
    logger.error(error, "Falha ao criar log de auditoria no banco de dados");
    // --- Fim da modificação ---
  }
};