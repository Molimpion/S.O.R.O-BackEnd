// src/services/userService.ts (REFATORADO)

import { PrismaClient } from '@prisma/client';
import { createLog } from './logService';
import { NotFoundError } from '../errors/api-errors'; // <-- NOVO IMPORT

const prisma = new PrismaClient();

// Serviço para listar todos os usuários
export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      profile: true,
      createdAt: true,
    },
  });
  return users;
};

// Serviço para buscar um usuário por ID
export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      profile: true,
      createdAt: true,
    },
  });

  if (!user) {
    // ALTERAÇÃO: Usando nosso erro customizado
    throw new NotFoundError('Usuário não encontrado');
  }
  return user;
};

// Serviço para atualizar um usuário
export const updateUser = async (id: string, data: any, adminUserId: string) => {
  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      name: data.name,
      email: data.email,
      profile: data.profile,
    },
    select: {
      id: true,
      name: true,
      email: true,
      profile: true,
    },
  });

  await createLog({
    action: 'ADMIN_UPDATED_USER',
    userId: adminUserId,
    details: `Admin (ID: ${adminUserId}) atualizou o usuário '${updatedUser.name}' (ID: ${updatedUser.id}).`,
  });

  return updatedUser;
};

// Serviço para deletar um usuário
export const deleteUser = async (id: string, adminUserId: string) => {
  const userToDelete = await prisma.user.findUnique({ where: { id } });
  
  if (!userToDelete) {
    // ALTERAÇÃO: Usando nosso erro customizado
    throw new NotFoundError('Usuário a ser deletado não encontrado');
  }

  await prisma.user.delete({
    where: { id },
  });

  await createLog({
    action: 'ADMIN_DELETED_USER',
    userId: adminUserId,
    details: `Admin (ID: ${adminUserId}) deletou o usuário '${userToDelete.name}' (ID: ${userToDelete.id}).`,
  });
};