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
  await getUserById(id);

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      nome: data.nome,
      email: data.email,
      tipo_perfil: data.tipo_perfil,
      id_unidade_operacional_fk: data.id_unidade_operacional_fk,
    },
    select: {
      id: true,
      nome: true,
      email: true,
      tipo_perfil: true,
      id_unidade_operacional_fk: true,
    },
  });

  await createLog({
    action: 'ADMIN_UPDATED_USER',
    userId: adminUserId,
    details: `Admin (ID: ${adminUserId}) atualizou o usuário '${updatedUser.nome}' (ID: ${updatedUser.id}).`,
  });

  return updatedUser;
};

export const deleteUser = async (id: string, adminUserId: string) => {
  const userToDelete = await prisma.user.findUnique({ where: { id } });
  
  if (!userToDelete) {
    throw new NotFoundError('Usuário a ser deletado não encontrado');
  }

  await prisma.user.delete({
    where: { id },
  });

  await createLog({
    action: 'ADMIN_DELETED_USER',
    userId: adminUserId,
    details: `Admin (ID: ${adminUserId}) deletou o usuário '${userToDelete.nome}' (ID: ${userToDelete.id}).`,
  });
};