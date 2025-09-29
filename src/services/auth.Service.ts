// src/services/authService.ts (REFATORADO)

import { PrismaClient, Profile } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createLog } from './log.Service';
import { UnauthorizedError } from '../errors/api.errors'; // <-- NOVO IMPORT

const prisma = new PrismaClient();

// --- SERVIÇO DE CADASTRO ---
export const registerUser = async (data: any) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      password: hashedPassword,
      profile: data.profile as Profile,
    },
  });

  await createLog({
    action: 'USER_REGISTERED',
    userId: user.id,
    details: `Novo usuário '${user.name}' (${user.email}) criado.`,
  });

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// --- SERVIÇO DE LOGIN ---
export const loginUser = async (data: any) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    await createLog({
      action: 'USER_LOGIN_FAILURE',
      details: `Tentativa de login falhou para o email: ${data.email}. Motivo: Usuário não encontrado.`,
    });
    // ALTERAÇÃO: Usando nosso erro customizado
    throw new UnauthorizedError('Email ou senha inválidos');
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);

  if (!isPasswordValid) {
    await createLog({
      action: 'USER_LOGIN_FAILURE',
      userId: user.id,
      details: `Tentativa de login falhou para o usuário '${user.name}' (${user.email}). Motivo: Senha incorreta.`,
    });
    // ALTERAÇÃO: Usando nosso erro customizado
    throw new UnauthorizedError('Email ou senha inválidos');
  }

  await createLog({
    action: 'USER_LOGIN_SUCCESS',
    userId: user.id,
    details: `Usuário '${user.name}' (${user.email}) logou com sucesso.`,
  });

  const token = jwt.sign(
    { userId: user.id, profile: user.profile },
    process.env.JWT_SECRET as string,
    { expiresIn: '8h' }
  );

  const { password, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};