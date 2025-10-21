import { PrismaClient, ActionType } from '@prisma/client';

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
    console.error("Falha ao criar log de auditoria:", error);
  }
};