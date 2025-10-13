// src/services/authService.ts (CORRIGIDO)
import { PrismaClient, Profile } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createLog } from './logService';
import { UnauthorizedError } from '../errors/api-errors';

const prisma = new PrismaClient();

export const registerUser = async (data: any) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      nome: data.name, // ALTERADO
      senha_hash: hashedPassword, // ALTERADO
      tipo_perfil: data.profile as Profile, // ALTERADO
      matricula: data.matricula, // Assumindo que a matrícula virá no cadastro
      id_unidade_operacional_fk: data.id_unidade_operacional_fk, // Assumindo que virá no cadastro
    },
  });

  await createLog({
    action: 'USER_REGISTERED',
    userId: user.id,
    details: `Novo usuário '${user.nome}' (${user.email}) criado.`,
  });

  const { senha_hash, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const loginUser = async (data: any) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    await createLog({
      action: 'USER_LOGIN_FAILURE',
      details: `Tentativa de login falhou para o email: ${data.email}. Motivo: Usuário não encontrado.`,
    });
    throw new UnauthorizedError('Email ou senha inválidos');
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.senha_hash); // ALTERADO

  if (!isPasswordValid) {
    await createLog({
      action: 'USER_LOGIN_FAILURE',
      userId: user.id,
      details: `Tentativa de login falhou para o usuário '${user.nome}' (${user.email}). Motivo: Senha incorreta.`,
    });
    throw new UnauthorizedError('Email ou senha inválidos');
  }

  await createLog({
    action: 'USER_LOGIN_SUCCESS',
    userId: user.id,
    details: `Usuário '${user.nome}' (${user.email}) logou com sucesso.`,
  });

  const token = jwt.sign(
    { userId: user.id, profile: user.tipo_perfil }, // ALTERADO
    process.env.JWT_SECRET as string,
    { expiresIn: '8h' }
  );

  const { senha_hash, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};