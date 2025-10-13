// src/services/userService.ts (CORRIGIDO)
import { PrismaClient } from '@prisma/client';
import { createLog } from './logService';
import { NotFoundError } from '../errors/api-errors';

const prisma = new PrismaClient();

export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      nome: true,
      email: true,
      tipo_perfil: true,
      createdAt: true,
    },
  });
  return users;
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      nome: true,
      email: true,
      tipo_perfil: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new NotFoundError('Usuário não encontrado');
  }
  return user;
};

export const updateUser = async (id: string, data: any, adminUserId: string) => {
  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      nome: data.name,
      email: data.email,
      tipo_perfil: data.profile,
    },
    select: {
      id: true,
      nome: true,
      email: true,
      tipo_perfil: true,
    },
  });

  await createLog({
    action: 'ADMIN_UPDATED_USER',
    userId: adminUserId,
    details: `Admin (ID: ${adminUserId}) atualizou o usuário '${updatedUser.nome}' (ID: ${updatedUser.id}).`,
  });

  return updatedUser;
};