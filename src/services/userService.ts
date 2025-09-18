// src/services/userService.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Serviço para listar todos os usuários
export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    // Seleciona os campos que queremos retornar, para nunca expor a senha
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
export const updateUser = async (id: string, data: any) => {
  const user = await prisma.user.update({
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
  return user;
};

// Serviço para deletar um usuário
export const deleteUser = async (id: string) => {
  await prisma.user.delete({
    where: { id },
  });
  // Não retorna nada em caso de sucesso
};