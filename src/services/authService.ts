// src/services/authService.ts (CONECTADO AO emailService)
import { PrismaClient, Profile } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createLog } from './logService';
import { UnauthorizedError } from '../errors/api-errors';
import * as crypto from 'crypto'; 
import { sendWelcomeEmail } from './emailService'; // <-- PASSO 3: Importa a função

const prisma = new PrismaClient();

// --- FUNÇÃO registerUser MODIFICADA ---
export const registerUser = async (data: any) => {
  
  // 1. Gerar Senha Temporária Segura
  const tempPassword = crypto.randomBytes(8).toString('hex');
  console.log(`Senha temporária gerada para ${data.email}: ${tempPassword}`); 

  // 2. Fazer o hash da SENHA TEMPORÁRIA
  const hashedPassword = await bcrypt.hash(tempPassword, 10);

  // 3. Criar o usuário no banco
  const user = await prisma.user.create({
    data: {
      email: data.email,
      nome: data.name, 
      senha_hash: hashedPassword, 
      tipo_perfil: data.profile as Profile, 
      matricula: data.matricula, 
      id_unidade_operacional_fk: data.id_unidade_operacional_fk, 
    },
  });

  // --- PASSO 3: Chamar o Serviço de E-mail ---
  try {
    // Chamamos nosso emailService com os dados necessários
    await sendWelcomeEmail(
      user.email,       // E-mail do destinatário
      user.nome,        // Nome para personalizar
      tempPassword      // A senha em TEXTO PLANO gerada no início
    );
  } catch (emailError) {
    // Se sendWelcomeEmail lançar um erro, nós o capturamos aqui
    console.error(`ALERTA: Falha ao enviar e-mail de boas-vindas para ${user.email}. O usuário foi criado, mas o e-mail não foi enviado. Erro:`, emailError);
    // Apenas logamos o erro por enquanto.
  }
  // --- FIM DO PASSO 3 ---

  // 5. Criar o log de auditoria
  await createLog({
    action: 'USER_REGISTERED',
    userId: user.id,
    details: `Novo usuário '${user.nome}' (${user.email}) criado com senha temporária.`, 
  });

  // 6. Retornar o usuário sem a senha hasheada
  const { senha_hash, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
// --- FIM DA FUNÇÃO registerUser MODIFICADA ---

// --- FUNÇÃO loginUser MANTIDA ORIGINAL ---
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

  const isPasswordValid = await bcrypt.compare(data.password, user.senha_hash); 

  if (!isPasswordValid) {
    await createLog({
      action: 'USER_LOGIN_FAILURE',
      userId: user.id,
      details: `Tentativa de login falhou para o usuário '${user.nome}' (${user.email}). Motivo: Senha incorreta.`,
    });
    throw new UnauthorizedError('Email ou senha inválidos');
  }

  // (Opcional) Adicionar verificação do flag 'precisa_trocar_senha' aqui
  // if (user.precisa_trocar_senha) {
  //   // Retornar um status/mensagem especial para forçar a troca no frontend
  // }

  await createLog({
    action: 'USER_LOGIN_SUCCESS',
    userId: user.id,
    details: `Usuário '${user.nome}' (${user.email}) logou com sucesso.`,
  });

  const token = jwt.sign(
    { userId: user.id, profile: user.tipo_perfil }, 
    process.env.JWT_SECRET as string,
    { expiresIn: '8h' }
  );

  const { senha_hash, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};
// --- FIM DA FUNÇÃO loginUser MANTIDA ORIGINAL ---