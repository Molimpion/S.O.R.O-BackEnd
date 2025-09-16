// src/services/authService.ts

import { PrismaClient, Profile } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Cria uma instância do Prisma Client para interagir com o banco
const prisma = new PrismaClient();

// Esta é a "chave secreta" para assinar nossos tokens.
// IMPORTANTE: Em um projeto real, isso deve estar no arquivo .env!
const JWT_SECRET = 'SEGREDO_SUPER_SECRETO_PARA_PROJETO_BOMBEIROS';

// --- SERVIÇO DE CADASTRO ---
export const registerUser = async (data: any) => {
  // 1. Criptografa a senha recebida antes de salvar
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // 2. Cria o novo usuário no banco de dados com a senha criptografada
  const user = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      password: hashedPassword,
      profile: data.profile as Profile // Garante que o perfil seja do tipo correto
    },
  });

  // 3. Retorna o usuário criado (sem a senha)
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// --- SERVIÇO DE LOGIN ---
export const loginUser = async (data: any) => {
  // 1. Procura o usuário no banco pelo e-mail
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  // 2. Se o usuário não for encontrado, lança um erro
  if (!user) {
    throw new Error('Email ou senha inválidos');
  }

  // 3. Compara a senha enviada com a senha criptografada no banco
  const isPasswordValid = await bcrypt.compare(data.password, user.password);

  // 4. Se a senha não for válida, lança um erro
  if (!isPasswordValid) {
    throw new Error('Email ou senha inválidos');
  }

  // 5. Se tudo estiver correto, gera um Token JWT
  const token = jwt.sign(
    { userId: user.id, profile: user.profile }, // Informações que guardamos no token
    JWT_SECRET,
    { expiresIn: '8h' } // Define a validade do token (ex: 8 horas)
  );

  // 6. Retorna as informações do usuário (sem a senha) e o token
  const { password, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};