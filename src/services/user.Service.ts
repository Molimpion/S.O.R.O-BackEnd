// src/services/userService.ts (ATUALIZADO COM LOGS)

import { PrismaClient } from '@prisma/client';
import { createLog } from './log.Service'; // <-- 1. IMPORTAMOS O SERVIÇO DE LOG

const prisma = new PrismaClient();

// Serviço para listar todos os usuários
export const getAllUsers = async () => {
  // Nota: Não vamos logar a listagem de todos os usuários por padrão
  // para evitar poluir o log, mas poderíamos adicionar aqui se necessário.
  // Ex: createLog({ action: 'ADMIN_VIEWED_USERS', ... })
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
    throw new Error('Usuário não encontrado');
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

  // ++ REGISTRA O LOG DE ATUALIZAÇÃO ++
  await createLog({
    action: 'ADMIN_UPDATED_USER',
    userId: adminUserId, // Registra QUEM fez a ação
    details: `Admin (ID: ${adminUserId}) atualizou o usuário '${updatedUser.name}' (ID: ${updatedUser.id}).`,
  });

  return updatedUser;
};

// Serviço para deletar um usuário
export const deleteUser = async (id: string, adminUserId: string) => {
  // Primeiro, buscamos os dados do usuário para usar no log
  const userToDelete = await prisma.user.findUnique({ where: { id } });
  
  if (!userToDelete) {
    throw new Error('Usuário a ser deletado não encontrado.');
  }

  await prisma.user.delete({
    where: { id },
  });

  // ++ REGISTRA O LOG DE EXCLUSÃO ++
  await createLog({
    action: 'ADMIN_DELETED_USER',
    userId: adminUserId, // Registra QUEM fez a ação
    details: `Admin (ID: ${adminUserId}) deletou o usuário '${userToDelete.name}' (ID: ${userToDelete.id}).`,
  });
};