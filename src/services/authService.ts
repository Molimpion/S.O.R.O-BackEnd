// src/services/authService.ts (ATUALIZADO COM LOGS)

import { PrismaClient, Profile } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createLog } from './logService'; // <-- 1. IMPORTAMOS O SERVIÇO DE LOG

const prisma = new PrismaClient();
const JWT_SECRET = 'SEGREDO_SUPER_SECRETO_PARA_PROJETO_BOMBEIROS';

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

  // ++ REGISTRA O LOG DE NOVO USUÁRIO ++
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
    // ++ REGISTRA A TENTATIVA DE LOGIN FALHA (USUÁRIO INEXISTENTE) ++
    await createLog({
      action: 'USER_LOGIN_FAILURE',
      details: `Tentativa de login falhou para o email: ${data.email}. Motivo: Usuário não encontrado.`,
    });
    throw new Error('Email ou senha inválidos');
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);

  if (!isPasswordValid) {
    // ++ REGISTRA A TENTATIVA DE LOGIN FALHA (SENHA INCORRETA) ++
    await createLog({
      action: 'USER_LOGIN_FAILURE',
      userId: user.id,
      details: `Tentativa de login falhou para o usuário '${user.name}' (${user.email}). Motivo: Senha incorreta.`,
    });
    throw new Error('Email ou senha inválidos');
  }

  // ++ REGISTRA O LOGIN BEM-SUCEDIDO ++
  await createLog({
    action: 'USER_LOGIN_SUCCESS',
    userId: user.id,
    details: `Usuário '${user.name}' (${user.email}) logou com sucesso.`,
  });

  const token = jwt.sign(
    { userId: user.id, profile: user.profile },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  const { password, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};